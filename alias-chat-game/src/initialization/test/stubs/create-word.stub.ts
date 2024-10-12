import { Types } from 'mongoose';
import { WordDocument } from '../../../words/schemas/word.schema';

export const wordDocumentStub = (): Partial<WordDocument> => ({
  wordId: new Types.ObjectId(),
  word: 'example',
  similarWords: ['sample', 'test'],
  _id: new Types.ObjectId(),
});
