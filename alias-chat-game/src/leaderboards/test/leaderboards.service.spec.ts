import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardsService } from '../leaderboards.service';
import { UsersService } from '../../users/users.service';
import { safeUserStub } from '../../users/test/stubs/safe-user.stub';
import { InternalServerErrorException } from '@nestjs/common';

describe('LeaderboardsService', () => {
  let laderboardsService: LeaderboardsService;

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

    laderboardsService = module.get<LeaderboardsService>(LeaderboardsService);
  });

  describe('getLeaderboards', () => {
    it('should return a list of users from the leaderboard', async () => {
      mockUsersService.getUsers = jest.fn().mockResolvedValue([safeUserStub()]);

      const result = await laderboardsService.getLeaderboards();

      expect(mockUsersService.getUsers).toHaveBeenCalled();
      expect(result).toEqual([safeUserStub()]);
    });

    it('should return an empty array if users are not found', async () => {
      mockUsersService.getUsers = jest.fn().mockResolvedValue([]);

      const result = await laderboardsService.getLeaderboards();

      expect(mockUsersService.getUsers).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException if a general error occurs', async () => {
      mockUsersService.getUsers = jest.fn().mockResolvedValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(laderboardsService.getLeaderboards()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
