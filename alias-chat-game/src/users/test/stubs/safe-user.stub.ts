import { UserSafeDto } from 'src/users/dto/user-safe.dto';

export const safeUserStub = (): UserSafeDto => ({
  userId: '66f8f7fb027b5bb2be6d0dd9',
  username: 'testuser',
  score: 0,
  played: 0,
  wins: 0,
});
