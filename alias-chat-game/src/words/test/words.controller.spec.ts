import { Test, TestingModule } from '@nestjs/testing';
import { WordsController } from '../words.controller';
import { WordsService } from '../words.service';
import { Word } from '../schemas/word.schema';
import { wordStub } from './stubs/word.stub';
import { CreateWordDto } from '../dto/create-word.dto';
import { UpdateWordDto } from '../dto/update-word.dto';

// npm test words.controller
jest.mock('../words.service');

describe('WordsController', () => {
  let wordsController: WordsController;
  let wordsService: WordsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [WordsController],
      providers: [WordsService],
    }).compile();

    wordsController = moduleRef.get<WordsController>(WordsController);
    wordsService = moduleRef.get<WordsService>(WordsService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let word: Word;

      beforeEach(async () => {
        word = await wordsController.findOne(wordStub().wordId);
      });

      test('then it should call wordsService.findOne', () => {
        expect(wordsService.findOne).toHaveBeenCalledWith(wordStub().wordId);
      });

      test('then it should return a word', () => {
        expect(word).toEqual(wordStub());
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let word: Word;
      let createWordDto: CreateWordDto;

      beforeEach(async () => {
        createWordDto = {
          word: wordStub().word,
          similarWords: wordStub().similarWords,
        };
        word = await wordsController.create(createWordDto);
      });

      test('then it should call wordsService.create', () => {
        expect(wordsService.create).toHaveBeenCalledWith(createWordDto);
      });

      test('then it should return a word', () => {
        expect(word).toEqual(wordStub());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let words: Word[];

      beforeEach(async () => {
        words = await wordsController.findAll();
      });

      test('then it should call wordsService.findAll', () => {
        expect(wordsService.findAll).toHaveBeenCalled();
      });

      test('then it should return an array of words', () => {
        expect(words).toEqual([wordStub()]);
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let word: Word;
      let updateWordDto: UpdateWordDto;

      beforeEach(async () => {
        updateWordDto = {
          word: 'updated',
          similarWords: ['updated1', 'updated2'],
        };
        word = await wordsController.update(wordStub().wordId, updateWordDto);
      });

      test('then it should call wordsService.update', () => {
        expect(wordsService.update).toHaveBeenCalledWith(
          wordStub().wordId,
          updateWordDto,
        );
      });

      test('then it should return the updated word', () => {
        expect(word).toEqual(wordStub());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let message: { message: string };

      beforeEach(async () => {
        message = await wordsController.remove(wordStub().wordId);
      });

      test('then it should call wordsService.remove', () => {
        expect(wordsService.remove).toHaveBeenCalledWith(wordStub().wordId);
      });

      test('then it should return successfull message', () => {
        expect(message).toEqual({ message: 'Word succesfully deleted.' });
      });
    });
  });
});
