import { Types } from 'mongoose';

export const createLeaderboardsStub = () => {
  const expectedResult = [
    {
      _id: new Types.ObjectId('670638a6fc1e4ab425b4a104'),
      username: 'Slava',
      played: 50,
      score: 1000,
      wins: 50,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd4'),
      username: 'Kate',
      score: 180,
      played: 15,
      wins: 10,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd1'),
      username: 'Alex',
      score: 150,
      played: 10,
      wins: 7,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd8'),
      username: 'Wolv',
      score: 130,
      played: 13,
      wins: 6,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd2'),
      username: 'Mike',
      score: 120,
      played: 12,
      wins: 5,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd6'),
      username: 'Ron',
      score: 110,
      played: 9,
      wins: 4,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd3'),
      username: 'Tom',
      score: 95,
      played: 8,
      wins: 3,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd5'),
      username: 'Tomas',
      score: 85,
      played: 7,
      wins: 2,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd9'),
      username: 'Lina',
      score: 75,
      played: 5,
      wins: 1,
    },
    {
      _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd0'),
      username: 'Patric',
      score: 60,
      played: 4,
      wins: 0,
    },
  ];
  return expectedResult;
};
