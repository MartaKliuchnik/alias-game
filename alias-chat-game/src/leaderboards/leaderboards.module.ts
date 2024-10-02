import { Module } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';
import { LeaderboardsController } from './leaderboards.controller';
import { UsersModule } from 'src/users/users.module';

// leaderboardsModule imports UsersModule and provides leaderboards functionality.
@Module({
  imports: [UsersModule],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
})
export class LeaderboardsModule {}
