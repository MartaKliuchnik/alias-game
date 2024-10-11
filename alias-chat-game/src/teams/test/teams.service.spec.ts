import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TeamsService } from '../teams.service';
import { Team } from '../schemas/team.schema';
import { createTeamStub, teamArrStub, teamStub } from './stubs/team.stub';
import { playersStub, userStub } from './stubs/user.stub';
import { UsersService } from '../../users/users.service';
import { RoomsService } from '../../rooms/rooms.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';

describe('TeamsService', () => {
  let teamsService: TeamsService;
  let teamModel: Model<Team>;
  let usersService: Partial<UsersService>;
  let roomsService: Partial<RoomsService>;

  beforeEach(async () => {
    usersService = {};
    roomsService = {};
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getModelToken(Team.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        { provide: UsersService, useValue: usersService },
        { provide: RoomsService, useValue: roomsService },
      ],
    }).compile();

    teamsService = moduleRef.get<TeamsService>(TeamsService);
    teamModel = moduleRef.get<Model<Team>>(getModelToken(Team.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

});
