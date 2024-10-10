import { CreateWordDto } from '../../dto/create-word.dto';

export const createWordStub = (): CreateWordDto => {
  return { word: 'example', similarWords: ['sample', 'test'] };
};
