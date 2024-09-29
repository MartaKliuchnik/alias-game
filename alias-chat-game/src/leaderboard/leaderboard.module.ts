import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { UsersModule } from 'src/users/users.module';

// LeaderboardModule imports UsersModule and provides Leaderboard functionality.
@Module({
  imports: [UsersModule],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule {}
