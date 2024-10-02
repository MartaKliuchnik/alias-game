import { Types } from 'mongoose';
import { Word } from '../../schemas/word.schema';

export const wordStub = (): Word => {
  return {
    wordId: new Types.ObjectId('66fac977d5bc7a67d4b6ff9f'),
    word: 'test',
    similarWords: ['test1', 'test2', 'test3'],
  };
};
