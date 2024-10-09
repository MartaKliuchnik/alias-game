import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import { RoomsService } from '../../../rooms/rooms.service';
import { TeamsService } from '../../../teams/teams.service';
import { ConfigService } from '@nestjs/config';
import { InitializationService } from '../../initialization.service';
import { INestApplication } from '@nestjs/common';

describe('InitializationService', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let initializationService: InitializationService;
  let roomsService: RoomsService;
  let teamsService: TeamsService;
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
    configService = app.get<ConfigService>(ConfigService);
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('rooms').deleteMany({});
    await dbConnection.collection('teams').deleteMany({});
  });

  describe('onModuleInit', () => {
    it('should create default rooms and teams in development environment', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');

      await initializationService.onModuleInit();

      const rooms = await roomsService.findAll();
      expect(rooms).toHaveLength(2);
      expect(rooms[0].name).toBe('Room1');
      expect(rooms[1].name).toBe('Room2');

      expect(rooms[0].teams).toHaveLength(3);
      expect(rooms[1].teams).toHaveLength(3);

      for (const room of rooms) {
        expect(room.teams).toHaveLength(3);
        const teams = await teamsService.findAll(room._id);
        expect(teams[0].name).toBe('Team1');
        expect(teams[1].name).toBe('Team2');
        expect(teams[2].name).toBe('Team3');
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

  describe('Error Handling', () => {
    it('should handle errors when creating room', async () => {
      jest
        .spyOn(roomsService, 'create')
        .mockRejectedValue(new Error('Could not create room'));

      await expect(initializationService.onModuleInit()).rejects.toThrow(
        'Could not create room',
      );
    });
  });
});
