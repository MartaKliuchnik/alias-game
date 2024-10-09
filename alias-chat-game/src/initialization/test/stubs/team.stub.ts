import { Types } from 'mongoose';

export const team1Stub = () => {
  return {
    roomId: new Types.ObjectId('66fcf032db11669500bcb946'),
    name: 'Team1',
    teamScore: 0,
    players: [],
    chatId: null,
    describer: null,
    description: null,
    tryedWords: [],
    teamLeader: null,
    success: null,
    answer: null,
    _id: new Types.ObjectId('66fcf032db11669500bcb934'),
    __v: 0,
  };
};

export const team2Stub = () => {
  return {
    roomId: new Types.ObjectId('66fcf032db11669500bcb946'),
    name: 'Team2',
    teamScore: 0,
    players: [],
    chatId: null,
    describer: null,
    description: null,
    tryedWords: [],
    teamLeader: null,
    success: null,
    answer: null,
    _id: new Types.ObjectId('66fcf032db11669500bcb935'),
    __v: 0,
  };
};

export const team3Stub = () => {
  return {
    roomId: new Types.ObjectId('66fcf032db11669500bcb946'),
    name: 'Team3',
    teamScore: 0,
    players: [],
    chatId: null,
    describer: null,
    description: null,
    tryedWords: [],
    teamLeader: null,
    success: null,
    answer: null,
    _id: new Types.ObjectId('66fcf032db11669500bcb936'),
    __v: 0,
  };
};
