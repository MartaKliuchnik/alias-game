import { Types } from 'mongoose';

export const room1Stub = () => {
  return {
    _id: new Types.ObjectId('66fcf032db11669500bcb946'),
    name: 'Room1',
    joinedUsers: [],
    teams: [],
    turnTime: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  };
};

export const room2Stub = () => {
  return {
    _id: new Types.ObjectId('66fcf032db11669500bcb947'),
    name: 'Room2',
    joinedUsers: [],
    teams: [],
    turnTime: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  };
};
