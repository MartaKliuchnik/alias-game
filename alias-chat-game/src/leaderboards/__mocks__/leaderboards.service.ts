import { leaderboardsStub } from '../test/stubs/leaderboards.stub';

export const LeaderboardsService = jest.fn().mockReturnValue({
  getLeaderboards: jest.fn().mockResolvedValue(leaderboardsStub()),
});
