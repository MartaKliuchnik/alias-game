import { CreateWordDto } from '../../dto/create-word.dto';

export const createWordsStub = (): CreateWordDto[] => {
  return [
    { word: 'example1', similarWords: ['sample1', 'test1'] },
    { word: 'example2', similarWords: ['sample2', 'test2'] },
  ];
};
