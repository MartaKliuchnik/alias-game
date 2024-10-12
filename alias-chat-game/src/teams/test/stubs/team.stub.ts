import { Types } from 'mongoose';
import { Team } from '../../schemas/team.schema';

export const createTeamStub = () => {
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

export const teamArrStub = () => {
  return [
    {
      roomId: new Types.ObjectId('66fac977d5bc7a67d4b6aa01'),
      name: 'Team 1',
      teamScore: 30,
      selectedWord: new Types.ObjectId('66fac977d8ed7a67d4b6aa01'),
      players: [
        new Types.ObjectId('66fac977d5bc7a67d4b6ff90'),
        new Types.ObjectId('66fac977d5bc7a67d4b6ff91'),
        new Types.ObjectId('66fac977d5bc7a67d4b6ff92'),
      ],
      chatId: new Types.ObjectId('66fac977d5bc7a67d4b6aa01'),
      describer: new Types.ObjectId('66fac978f73c7a67d4b6aa01'),
      description: 'Word description string from describer.',
      tryedWords: [],
      teamLeader: new Types.ObjectId('66fac978f73c7a675636aa01'),
      success: false,
      answer: 'Answer',
      _id: new Types.ObjectId('66fac977d8ed7a67d4b6bb01'),
      __v: 0,
    },
    {
      roomId: new Types.ObjectId('66fac977d6bc8a67d4b7aa02'),
      name: 'Team 2',
      teamScore: 45,
      selectedWord: new Types.ObjectId('66fac977d9ed8a67d4b7aa02'),
      players: [
        new Types.ObjectId('66fac977d6bc8a67d4b7ff93'),
        new Types.ObjectId('66fac977d6bc8a67d4b7ff94'),
        new Types.ObjectId('66fac977d6bc8a67d4b7ff95'),
      ],
      chatId: new Types.ObjectId('66fac978f6bc8a67d4b7aa02'),
      describer: new Types.ObjectId('66fac978f83c8a67d4b7aa02'),
      description: 'Another word description string.',
      tryedWords: ['word1', 'word2'],
      teamLeader: new Types.ObjectId('66fac978f83c8a675637aa02'),
      success: true,
      answer: 'Correct answer',
      _id: new Types.ObjectId('66fac977d9ed8a67d4b7bb02'),
      __v: 0,
    },
  ];
};

export const teamStub = (): Team & { teamId } => {
  return {
    teamId: new Types.ObjectId('66fac977d5bc7a67d4b6ff9f'),
    roomId: new Types.ObjectId('66fac977d5bc7a67d4b6aa01'),
    name: 'Team 1',
    teamScore: 30,
    selectedWord: new Types.ObjectId('66fac977d8ed7a67d4b6aa01'),
    players: [
      new Types.ObjectId('66fac977d5bc7a67d4b6ff90'),
      new Types.ObjectId('66fac977d5bc7a67d4b6ff91'),
      new Types.ObjectId('66fac977d5bc7a67d4b6ff92'),
    ],
    chatId: new Types.ObjectId('66fac978f5bc7a67d4b6aa01'),
    describer: new Types.ObjectId('66fac978f73c7a67d4b6aa01'),
    description: 'Word description string from describer.',
    tryedWords: [],
    teamLeader: new Types.ObjectId('66fac978f73c7a675636aa01'),
    success: false,
    answer: 'Answer',
  };
};
