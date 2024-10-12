import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import { RoomsService } from '../../../rooms/rooms.service';
import { TeamsService } from '../../../teams/teams.service';
import { ConfigService } from '@nestjs/config';
import { InitializationService } from '../../initialization.service';
import { INestApplication } from '@nestjs/common';
import { WordsService } from '../../../words/words.service';

describe('InitializationService (Integration)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let initializationService: InitializationService;
  let roomsService: RoomsService;
  let teamsService: TeamsService;
  let wordsService: WordsService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    initializationService = app.get<InitializationService>(
      InitializationService,
    );
    roomsService = app.get<RoomsService>(RoomsService);
    teamsService = app.get<TeamsService>(TeamsService);
    wordsService = app.get<WordsService>(WordsService);
    configService = app.get<ConfigService>(ConfigService);
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
  });

  afterAll(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    await dbConnection.collection('rooms').deleteMany({});
    await dbConnection.collection('teams').deleteMany({});
    await dbConnection.collection('words').deleteMany({});
  });

  describe('onModuleInit', () => {
    it('should create default rooms and teams in development environment', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');

      await initializationService.onModuleInit();

      const rooms = await roomsService.findAll();
      expect(rooms).toHaveLength(2);
      expect(rooms[0].name).toBe('Room1');
      expect(rooms[1].name).toBe('Room2');

      expect(rooms[0].teams).toHaveLength(2);
      expect(rooms[1].teams).toHaveLength(2);

      for (const room of rooms) {
        expect(room.teams).toHaveLength(2);
        const teams = await teamsService.findAll(room._id);
        expect(teams[0].name).toBe('Team1');
        expect(teams[1].name).toBe('Team2');
      }
    });

    it('should not create rooms if they already exist', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      await roomsService.create({ name: 'Room1', teams: [], turnTime: 60 });

      await initializationService.onModuleInit();

      const rooms = await roomsService.findAll();
      expect(rooms).toHaveLength(2);
    });

    it('should not delete existing rooms in production environment', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('production');

      await roomsService.create({ name: 'NewRoom', teams: [], turnTime: 60 });

      await initializationService.onModuleInit();

      const rooms = await roomsService.findAll();
      expect(rooms).toHaveLength(3);
      expect(rooms.some((room) => room.name === 'NewRoom')).toBeTruthy();
    });
  });

  describe('Word Creation', () => {
    it('should create default words if none exist', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');

      await initializationService.onModuleInit();

      const words = await wordsService.findAll();
      expect(words.length).toBeGreaterThan(0);
      expect(words.some((word) => word.word === 'bicycle')).toBeTruthy();
      expect(words.some((word) => word.word === 'garden')).toBeTruthy();
    });

    it('should not create words if they already exist', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      await wordsService.create({
        word: 'bicycle',
        similarWords: ['bike', 'cycle'],
      });

      await initializationService.onModuleInit();

      const words = await wordsService.findAll();
      const bicycleWords = words.filter((word) => word.word === 'bicycle');
      expect(bicycleWords).toHaveLength(1);
    });

    it('should create words in both development and production environments', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');

      await initializationService.onModuleInit();

      let words = await wordsService.findAll();
      expect(words.length).toBeGreaterThan(0);

      await dbConnection.collection('words').deleteMany({});

      jest.spyOn(configService, 'get').mockReturnValue('production');

      await initializationService.onModuleInit();

      words = await wordsService.findAll();
      expect(words.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should handle errors when creating room', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      jest
        .spyOn(roomsService, 'create')
        .mockRejectedValue(new Error('Could not create room'));

      await expect(initializationService.onModuleInit()).rejects.toThrow(
        'Could not create room',
      );
    });

    it('should handle errors when creating words', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      const room = await roomsService.create({
        name: 'NewRoom',
        teams: [],
        turnTime: 60,
      });
      jest.spyOn(roomsService, 'create').mockResolvedValue(room);
      jest
        .spyOn(wordsService, 'create')
        .mockRejectedValue(new Error('Failed to create word'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await initializationService.onModuleInit();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to create word 'bicycle':",
        'Failed to create word',
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
