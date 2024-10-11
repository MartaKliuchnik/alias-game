import { Types } from 'mongoose';
import { User } from '../../../users/schemas/user.schema';
import { UserSafeDto } from '../../../users/dto/user-safe.dto';

export const playersStub = (): UserSafeDto[] => {
  return [
    {
      userId: '60d0fe4f5311236168a109ca',
      username: 'PlayerOne',
      score: 1000,
      played: 50,
      wins: 30,
    },
    {
      userId: '60d0fe4f5311236168a109cb',
      username: 'PlayerTwo',
      score: 900,
      played: 45,
      wins: 25,
    },
    {
      userId: '60d0fe4f5311236168a109cc',
      username: 'PlayerThree',
      score: 800,
      played: 40,
      wins: 20,
    },
  ];
};

export const userStub = (): User => {
  return {
    userId: new Types.ObjectId('60d0fe4f5311236168a109ca'),
    username: 'playerOne',
    hashedPassword: 'hashedPassword1',
    score: 10,
    played: 5,
    wins: 2,
  };
};
