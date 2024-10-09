import { team1Stub } from '../test/stubs/team.stub';

export const TeamsService = jest.fn().mockReturnValue({
  deleteAllTeams: jest.fn(),
  create: jest.fn().mockResolvedValue(team1Stub()),
});
