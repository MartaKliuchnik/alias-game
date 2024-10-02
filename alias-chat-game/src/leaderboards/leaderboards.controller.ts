import { Controller, Get } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';

// leaderboardsController fetches the leaderboards via leaderboardsService.
@Controller('leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  /**
   * @route GET /api/v1/users/leaderboards
   * @description Retrieve the top players' leaderboards
   * @access Public
   */
  @Get()
  findAll() {
    return this.leaderboardsService.getLeaderboards();
  }
}
