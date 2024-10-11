import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from '../teams.controller';
import { TeamsService } from '../teams.service';
import { createTeamStub, teamArrStub, teamStub } from './stubs/team.stub';
import { mockAuthGuard } from '../../users/__mocks__/auth.guard.mock';
import { AuthGuard } from '../../auth/gurards/auth.guard';
import { Team, TeamDocument } from '../schemas/team.schema';
import { CreateTeamDto } from '../dto/create-team.dto';
import { Types } from 'mongoose';
import { UsersService } from '../../users/users.service';

jest.mock('../teams.service');

describe('TeamsController', () => {
  let teamsController: TeamsController;
  let teamsService: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: {
            deleteAllTeams: jest.fn(),
            create: jest.fn().mockResolvedValue(createTeamStub()),
            findAll: jest.fn().mockResolvedValue(teamArrStub()),
            deleteAllTeamsFromRoom: jest
              .fn()
              .mockResolvedValue({ message: 'Success' }),
            findOne: jest.fn().mockResolvedValue(teamStub()),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    teamsController = module.get<TeamsController>(TeamsController);
    teamsService = module.get<TeamsService>(TeamsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when the create method is called', () => {
      let team: Team;
      let createTeamDto: CreateTeamDto;
      let roomId: Types.ObjectId;
      beforeEach(async () => {
        createTeamDto = {
          name: createTeamStub().name,
          players: createTeamStub().players,
        };
        roomId = createTeamStub().roomId;
        team = await teamsController.create(roomId, createTeamDto);
      });

      test('then it should call teamsService.create', () => {
        expect(teamsService.create).toHaveBeenCalledWith(roomId, createTeamDto);
      });

      test('then it should return a team', () => {
        expect(team).toEqual(createTeamStub());
      });
    });
  });

  describe('findAllTeams', () => {
    describe('when the findAllTeams method is called', () => {
      let teams: TeamDocument[];
      let roomId: Types.ObjectId;
      beforeEach(async () => {
        roomId = teamArrStub()[0].roomId;
        teams = await teamsController.findAllTeams(roomId, false);
      });

      test('then it should call teamsService.findAll', () => {
        expect(teamsService.findAll).toHaveBeenCalledWith(roomId, false);
      });

      test('then it should return an array of teams', () => {
        expect(teams).toEqual(teamArrStub());
      });
    });
  });

  describe('deleteAllTeams', () => {
    describe('when the deleteAllTeams method is called', () => {
      let roomId: Types.ObjectId;
      let res: { message };
      beforeEach(async () => {
        roomId = createTeamStub().roomId;
        res = await teamsController.deleteAllTeams(roomId);
      });

      test('then it should call teamsService.create', () => {
        expect(teamsService.deleteAllTeamsFromRoom).toHaveBeenCalledWith(
          roomId,
        );
      });

      test('then it should return a message', () => {
        expect(res).toEqual({ message: 'Success' });
      });
    });
  });

  describe('findOneTeam', () => {
    describe('when the findOneTeam method is called', () => {
      let roomId: Types.ObjectId;
      let teamId: Types.ObjectId;
      let team: TeamDocument;
      beforeEach(async () => {
        roomId = createTeamStub().roomId;
        teamId = createTeamStub()._id;
        team = await teamsController.findOneTeam(roomId, teamId);
      });

      test('then it should call teamsService.create', () => {
        expect(teamsService.findOne).toHaveBeenCalledWith(roomId, teamId);
      });

      test('then it should return a message', () => {
        expect(team).toEqual(teamStub());
      });
    });
  });
});
