import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from '../leaderboard.service';
import { UsersService } from '../../users/users.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  const mockUsersService = {
    getUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
