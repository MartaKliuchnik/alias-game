import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from '../leaderboard.controller';
import { LeaderboardService } from '../leaderboard.service';
import { UserSafeDto } from 'src/users/dto/user-safe.dto';
import { getLeaderboard } from '../__mock__/leaderboard';

describe('LeaderboardController', () => {
  let controller: LeaderboardController;
  let service: LeaderboardService;

  const mockLeaderboardService = {
    getLeaderboard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        {
          provide: LeaderboardService,
          useValue: mockLeaderboardService,
        },
      ],
    }).compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
    service = module.get<LeaderboardService>(LeaderboardService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of top 10 leaders', async () => {
      const expectedResult: UserSafeDto[] = getLeaderboard();
      mockLeaderboardService.getLeaderboard.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.getLeaderboard).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle an empty leaderboard', async () => {
      mockLeaderboardService.getLeaderboard.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.getLeaderboard).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
