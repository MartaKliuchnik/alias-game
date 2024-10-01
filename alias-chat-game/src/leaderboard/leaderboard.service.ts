import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserSafeDto } from 'src/users/dto/user-safe.dto';
import { UsersService } from '../users/users.service';

// LeaderboardService is responsible for retrieving the top players' leaderboard.
@Injectable()
export class LeaderboardService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves the top 10 users from the leaderboard, ordered by score.
   * @returns {Promise<UserSafeDto[]>} - A promise that resolves to an array of UserSafeDto objects.
   * @throws {InternalServerErrorException} - If an error occurs during the database operation.
   */
  async getLeaderboard(): Promise<UserSafeDto[]> {
    try {
      const users = await this.usersService.getUsers();

      const leaderboard = users.sort((a, b) => b.score - a.score).slice(0, 10);
      return leaderboard;
    } catch {
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving the leaderboard.',
      );
    }
  }
}
