import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardsService } from '../leaderboards.service';
import { UsersService } from '../../users/users.service';

describe('LeaderboardsService', () => {
  let service: LeaderboardsService;

  const mockUsersService = {
    getUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardsService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<LeaderboardsService>(LeaderboardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
