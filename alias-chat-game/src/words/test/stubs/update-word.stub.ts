import { UpdateWordDto } from './../../dto/update-word.dto';

export const updateWordStub = (): UpdateWordDto => {
  return {
    word: 'updatedExample',
    similarWords: ['updatedSample', 'updatedTest'],
  };
};
