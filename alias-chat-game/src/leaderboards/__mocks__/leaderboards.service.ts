import { leaderboardStub } from '../test/stubs/leaderboard.stub';

export const LeaderboardsService = jest.fn().mockReturnValue({
  getLeaderboards: jest.fn().mockResolvedValue(leaderboardStub()),
});
