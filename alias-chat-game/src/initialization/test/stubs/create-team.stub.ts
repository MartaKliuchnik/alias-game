import { Types } from 'mongoose';
import { CreateTeamDto } from '../../../teams/dto/create-team.dto';

export const createTeamStub = (): CreateTeamDto & {
  roomId: Types.ObjectId;
} => {
  return { roomId: new Types.ObjectId(), name: 'Team1', players: [] };
};
