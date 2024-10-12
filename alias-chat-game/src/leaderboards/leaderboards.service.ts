import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserSafeDto } from '../users/dto/user-safe.dto';
import { UsersService } from '../users/users.service';

// leaderboardsService is responsible for retrieving the top players' leaderboards.
@Injectable()
export class LeaderboardsService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves the top 10 users from the leaderboards, ordered by score.
   * @returns {Promise<UserSafeDto[]>} - A promise that resolves to an array of UserSafeDto objects.
   * @throws {InternalServerErrorException} - If an error occurs during the database operation.
   */
  async getLeaderboards(): Promise<UserSafeDto[]> {
    try {
      const users = await this.usersService.getUsers();

      const leaderboards = users.sort((a, b) => b.score - a.score).slice(0, 10);
      return leaderboards;
    } catch {
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving the leaderboards.',
      );
    }
  }
}
