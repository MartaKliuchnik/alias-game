import { wordStub } from './../test/stubs/word.stub';

export const WordsService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(wordStub()),
  findAll: jest.fn().mockResolvedValue([wordStub()]),
  findOne: jest.fn().mockResolvedValue(wordStub()),
  update: jest.fn().mockResolvedValue(wordStub()),
  remove: jest.fn().mockResolvedValue({ message: 'Word succesfully deleted.' }),
});
