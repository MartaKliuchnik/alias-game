import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { Room } from 'src/rooms/schemas/room.schema';
import { CreateTeamDto } from 'src/teams/dto/create-team.dto';
import { User } from 'src/users/schemas/user.schema';

export const createTestUser = async (
  username: string,
  password: string,
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = new Types.ObjectId();
  return {
    userId,
    username,
    hashedPassword,
    score: Math.floor(Math.random() * 100),
    played: Math.floor(Math.random() * 10),
    wins: Math.floor(Math.random() * 5),
  };
};

export const createTestRoom = (
  name: string,
  users: Types.ObjectId[] = [],
): Room => ({
  name,
  joinedUsers: users,
  teams: [],
  turnTime: 60,
});

export const createTestTeam = (
  name: string,
  roomId: Types.ObjectId,
  players: Types.ObjectId[],
): CreateTeamDto & { roomId: Types.ObjectId } => ({
  name,
  players,
  roomId,
});
