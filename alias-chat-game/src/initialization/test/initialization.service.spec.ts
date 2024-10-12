import { RoomsService } from '../../rooms/rooms.service';
import { TeamsService } from '../../teams/teams.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { InitializationService } from '../initialization.service';
import { createRoom1Stub, createRoom2Stub } from './stubs/create-room.stub';
import { room1Stub, room2Stub } from './stubs/room.stub';
import { team1Stub, team2Stub, team3Stub } from './stubs/team.stub';
import { Types } from 'mongoose';
import { WordsService } from '../../words/words.service';
import { CreateWordDto } from '../../words/dto/create-word.dto';
import { wordDocumentStub } from './stubs/create-word.stub';
import { WordDocument } from '../../words/schemas/word.schema';

jest.mock('../../rooms/rooms.service');
jest.mock('../../teams/teams.service');
jest.mock('../../words/words.service');
jest.mock('@nestjs/config');

describe('InitializationService (Unit)', () => {
  let initializationService: InitializationService;
  let roomsService: RoomsService;
  let teamsService: TeamsService;
  let configService: ConfigService;
  let wordsService: WordsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        InitializationService,
        {
          provide: RoomsService,
          useValue: {
            deleteAllRooms: jest.fn(),
            findAll: jest.fn(),
            create: jest
              .fn()
              .mockResolvedValueOnce(room1Stub())
              .mockResolvedValueOnce(room2Stub()),
            updateTeam: jest.fn(),
          },
        },
        {
          provide: TeamsService,
          useValue: {
            deleteAllTeams: jest.fn(),
            create: jest.fn().mockResolvedValue(team1Stub()),
          },
        },
        {
          provide: WordsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    initializationService = moduleRef.get<InitializationService>(
      InitializationService,
    );
    roomsService = moduleRef.get<RoomsService>(RoomsService);
    teamsService = moduleRef.get<TeamsService>(TeamsService);
    wordsService = moduleRef.get<WordsService>(WordsService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should delete rooms, teams, and create words in development environment', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('development');
      jest.spyOn(roomsService, 'findAll').mockResolvedValue([]);
      jest.spyOn(wordsService, 'findAll').mockResolvedValue([]);

      await initializationService.onModuleInit();

      expect(teamsService.deleteAllTeams).toHaveBeenCalled();
      expect(roomsService.deleteAllRooms).toHaveBeenCalled();
      expect(roomsService.findAll).toHaveBeenCalled();
      expect(roomsService.create).toHaveBeenCalledWith(createRoom1Stub());
      expect(roomsService.create).toHaveBeenCalledWith(createRoom2Stub());
      expect(wordsService.findAll).toHaveBeenCalled();
      expect(wordsService.create).toHaveBeenCalled();
    });

    it('should not delete rooms and teams but create words in non-development environment', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('production');
      jest.spyOn(roomsService, 'findAll').mockResolvedValue([]);
      jest.spyOn(wordsService, 'findAll').mockResolvedValue([]);

      await initializationService.onModuleInit();

      expect(teamsService.deleteAllTeams).not.toHaveBeenCalled();
      expect(roomsService.deleteAllRooms).not.toHaveBeenCalled();
      expect(wordsService.findAll).toHaveBeenCalled();
      expect(wordsService.create).toHaveBeenCalled();
    });
  });

  describe('createDefaultRooms', () => {
    it('should create default rooms and add teams if rooms do not exist', async () => {
      jest.spyOn(roomsService, 'findAll').mockResolvedValue([]);

      await initializationService['createDefaultRooms']();

      expect(roomsService.findAll).toHaveBeenCalledTimes(2);
      expect(roomsService.create).toHaveBeenCalledWith(createRoom1Stub());
      expect(roomsService.create).toHaveBeenCalledWith(createRoom2Stub());
    });

    it('should not create default rooms and add teams if rooms exist', async () => {
      const existingRoom = [room1Stub(), room2Stub()];
      roomsService.findAll = jest.fn().mockResolvedValue(existingRoom);

      await initializationService['createDefaultRooms']();

      expect(roomsService.findAll).toHaveBeenCalledTimes(2);
      expect(roomsService.create).not.toHaveBeenCalled();
    });
  });

  describe('addTeamsToRoom', () => {
    it('should add default teams to the room and update the room with team IDs', async () => {
      const roomId = new Types.ObjectId();

      teamsService.create = jest
        .fn()
        .mockResolvedValueOnce(team1Stub())
        .mockResolvedValueOnce(team2Stub())
        .mockResolvedValueOnce(team3Stub());

      await initializationService['addTeamsToRoom'](roomId);

      expect(teamsService.create).toHaveBeenCalledTimes(2);
      expect(roomsService.updateTeam).toHaveBeenCalledTimes(1);
    });
  });

  describe('createWords', () => {
    it('should create words if no words exist', async () => {
      jest.spyOn(wordsService, 'findAll').mockResolvedValue([]);
      const createWordSpy = jest
        .spyOn(wordsService, 'create')
        .mockImplementation((word: CreateWordDto) =>
          Promise.resolve({
            ...word,
            _id: new Types.ObjectId(),
          } as any),
        );

      await initializationService['createWords']();

      expect(wordsService.findAll).toHaveBeenCalled();
      expect(createWordSpy).toHaveBeenCalledTimes(10);
      expect(createWordSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          word: 'bicycle',
          similarWords: ['bike', 'cycle'],
        }),
      );
    });

    it('should not create words if words already exist', async () => {
      const existingWords = [wordDocumentStub() as WordDocument];
      jest.spyOn(wordsService, 'findAll').mockResolvedValue(existingWords);

      const createWordSpy = jest.spyOn(wordsService, 'create');

      await initializationService['createWords']();

      expect(wordsService.findAll).toHaveBeenCalled();
      expect(createWordSpy).not.toHaveBeenCalled();
    });

    it('should log error if word creation fails', async () => {
      jest.spyOn(wordsService, 'findAll').mockResolvedValue([]);
      jest
        .spyOn(wordsService, 'create')
        .mockRejectedValue(new Error('Database error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await initializationService['createWords']();

      expect(wordsService.findAll).toHaveBeenCalled();
      expect(wordsService.create).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create word'),
        'Database error',
      );
    });
  });
});
