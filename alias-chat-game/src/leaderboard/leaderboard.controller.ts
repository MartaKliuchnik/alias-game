import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

// LeaderboardController fetches the leaderboard via LeaderboardService.
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  /**
   * @route GET /api/v1/users/leaderboard
   * @description Retrieve the top players' leaderboard
   * @access Public
   */
  @Get()
  findAll() {
    return this.leaderboardService.getLeaderboard();
  }
}
