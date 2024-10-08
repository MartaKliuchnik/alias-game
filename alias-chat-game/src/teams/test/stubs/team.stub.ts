import { Types } from 'mongoose';
import { Team } from '../../schemas/team.schema';

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
