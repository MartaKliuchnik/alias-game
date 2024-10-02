import { UserSafeDto } from '../../../users/dto/user-safe.dto';

export const leaderboardStub = (): UserSafeDto[] => {
  const expectedResult: UserSafeDto[] = [
    {
      userId: '66f8f7fb027b5bb2be6d0dd7',
      username: 'Garry',
      score: 200,
      played: 20,
      wins: 12,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd4',
      username: 'Kate',
      score: 180,
      played: 15,
      wins: 10,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd1',
      username: 'Alex',
      score: 150,
      played: 10,
      wins: 7,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd8',
      username: 'Wolv',
      score: 130,
      played: 13,
      wins: 6,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd2',
      username: 'Mike',
      score: 120,
      played: 12,
      wins: 5,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd6',
      username: 'Ron',
      score: 110,
      played: 9,
      wins: 4,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd3',
      username: 'Tom',
      score: 95,
      played: 8,
      wins: 3,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd5',
      username: 'Tomas',
      score: 85,
      played: 7,
      wins: 2,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd9',
      username: 'Lina',
      score: 75,
      played: 5,
      wins: 1,
    },
    {
      userId: '66f8f7fb027b5bb2be6d0dd0',
      username: 'Patric',
      score: 60,
      played: 4,
      wins: 0,
    },
  ];
  return expectedResult;
};
