import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WordsService } from '../words.service';
import { Word } from '../schemas/word.schema';
import { Model, Types } from 'mongoose';
import { wordStub } from './stubs/word.stub';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// npm test words.service

describe('WordsService', () => {
  let wordsService: WordsService;
  let wordModel: Model<Word>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: getModelToken(Word.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    wordsService = moduleRef.get<WordsService>(WordsService);
    wordModel = moduleRef.get<Model<Word>>(getModelToken(Word.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new word if it does not exist', async () => {
      wordModel.findOne = jest.fn().mockResolvedValue(null);

      const createdWord = wordStub();
      wordModel.create = jest.fn().mockResolvedValue(createdWord);

      const result = await wordsService.create({
        word: createdWord.word,
        similarWords: createdWord.similarWords,
      });

      expect(wordModel.findOne).toHaveBeenCalledWith({
        word: createdWord.word,
      });
      expect(wordModel.create).toHaveBeenCalledWith({
        word: createdWord.word,
        similarWords: createdWord.similarWords,
      });
      expect(result).toEqual(createdWord);
    });

    it('should throw BadRequestException if word already exists', async () => {
      wordModel.findOne = jest.fn().mockResolvedValue(wordStub());

      await expect(
        wordsService.create({
          word: wordStub().word,
          similarWords: wordStub().similarWords,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of words', async () => {
      wordModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([wordStub()]),
      });

      const result = await wordsService.findAll();

      expect(wordModel.find).toHaveBeenCalled();
      expect(result).toEqual([wordStub()]);
    });
  });

  describe('findOne', () => {
    it('should return a word if it exists', async () => {
      wordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(wordStub()),
      });

      const result = await wordsService.findOne(wordStub().wordId);

      expect(wordModel.findById).toHaveBeenCalledWith(wordStub().wordId);
      expect(result).toEqual(wordStub());
    });

    it('should throw NotFoundException if word does not exist', async () => {
      wordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(wordsService.findOne(wordStub().wordId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a word successfully', async () => {
      wordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(wordStub()),
      });

      wordModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(wordStub()),
      });

      const result = await wordsService.update(wordStub().wordId, {
        word: 'updated word',
      });

      expect(wordModel.findById).toHaveBeenCalledWith(wordStub().wordId);
      expect(wordModel.findByIdAndUpdate).toHaveBeenCalledWith(
        wordStub().wordId,
        { word: 'updated word' },
        { new: true, runValidators: true },
      );
      expect(result).toEqual(wordStub());
    });

    it('should throw BadRequestException if no fields are provided for update', async () => {
      await expect(wordsService.update(wordStub().wordId, {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if word to update does not exist', async () => {
      wordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        wordsService.update(wordStub().wordId, { word: 'updated word' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a word successfully', async () => {
      wordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(wordStub()),
      });

      wordModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await wordsService.remove(wordStub().wordId);

      expect(wordModel.findById).toHaveBeenCalledWith(wordStub().wordId);
      expect(wordModel.findByIdAndDelete).toHaveBeenCalledWith(
        wordStub().wordId,
      );
      expect(result).toEqual({ message: 'Word succesfully deleted.' });
    });

    it('should throw NotFoundException if word to delete does not exist', async () => {
      wordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(wordsService.remove(wordStub().wordId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById (private)', () => {
    it('should throw BadRequestException if wordId is invalid', async () => {
      await expect(
        wordsService['findById']('invalid' as unknown as Types.ObjectId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if word is not found', async () => {
      wordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(wordsService['findById'](wordStub().wordId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a word if it exists', async () => {
      wordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(wordStub()),
      });

      const result = await wordsService['findById'](wordStub().wordId);

      expect(result).toEqual(wordStub());
    });
  });
});
