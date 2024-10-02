import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Word, WordDocument } from './schemas/word.schema';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import * as levenshtein from 'fast-levenshtein';
import * as natural from 'natural';

@Injectable()
export class WordsService {
  // eslint-disable-next-line prettier/prettier
  constructor(@InjectModel(Word.name) private wordModel: Model<WordDocument>) { }

  async create(createWordDto: CreateWordDto): Promise<WordDocument> {
    const existingWord = await this.wordModel.findOne({
      word: createWordDto.word,
    });
    if (existingWord) {
      throw new BadRequestException(
        `Word '${createWordDto.word}' already exists.`,
      );
    }

    const createdWord = await this.wordModel.create(createWordDto);
    return createdWord;
  }

  async findAll(): Promise<WordDocument[]> {
    return this.wordModel.find().exec();
  }

  async findOne(wordId: Types.ObjectId): Promise<WordDocument> {
    return this.findById(wordId);
  }

  async update(
    wordId: Types.ObjectId,
    updateWordDto: UpdateWordDto,
  ): Promise<WordDocument> {
    if (Object.keys(updateWordDto).length === 0) {
      throw new BadRequestException('At least one field must be updated.');
    }

    await this.findById(wordId);
    return this.wordModel
      .findByIdAndUpdate(wordId, updateWordDto, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async remove(wordId: Types.ObjectId): Promise<{ message: string }> {
    await this.findById(wordId);
    await this.wordModel.findByIdAndDelete(wordId).exec();
    return { message: 'Word succesfully deleted.' };
  }

  private async findById(wordId: Types.ObjectId): Promise<WordDocument> {
    if (!Types.ObjectId.isValid(wordId)) {
      throw new BadRequestException('Invalid word ID format.');
    }

    const word = await this.wordModel.findById(wordId).exec();
    if (!word) {
      throw new NotFoundException(`Word with ID '${wordId}' not found.`);
    }

    return word;
  }

  /**
   * Retrieves a random word that has not been tried yet.
   *
   * @param tryedWords - An array of ObjectIds representing words that have already been tried.
   * @returns A promise that resolves to an object containing a random word and the updated list of tried words.
   * @throws NotFoundException if no unused words are found.
   */
  async getRandomWord(
    tryedWords: Types.ObjectId[],
  ): Promise<{ word: WordDocument; tryedWords: Types.ObjectId[] }> {
    // Find words that are not in the list of tried words
    const unusedWords = await this.wordModel
      .find({
        _id: { $nin: tryedWords },
      })
      .exec();

    if (unusedWords.length === 0) {
      throw new NotFoundException('No unused words found.');
    }

    // Select a random word from the unused words
    const randomIndex = Math.floor(Math.random() * unusedWords.length);
    const randomWord = unusedWords[randomIndex];

    tryedWords.push(randomWord._id);

    return {
      word: randomWord,
      tryedWords,
    };
  }

  /**
   * Checks if the provided answer matches the word or any of its similar words.
   *
   * @param wordId - The ObjectId of the word to check against.
   * @param answer - The answer string to be validated.
   * @returns A promise that resolves to a boolean indicating if the answer is correct.
   */
  async checkAnswer(wordId: Types.ObjectId, answer: string): Promise<boolean> {
    const wordDocument = await this.findById(wordId);

    const isCorrect = await this.compareWords(wordDocument.word, answer);
    if (isCorrect) return true;

    // Compare the answer with each of the similar words
    for (const similarWord of wordDocument.similarWords) {
      const isSimilar = await this.compareWords(similarWord, answer);
      if (isSimilar) return true;
    }

    return false;
  }

  /**
   * Checks if the description does not contain the word or any of its similar words.
   *
   * @param wordId - The ObjectId of the word to be checked.
   * @param description - The description string to be validated.
   * @returns A promise that resolves to a boolean indicating if the description is valid (i.e., contains no matching words).
   */
  async checkDescription(
    wordId: Types.ObjectId,
    description: string,
  ): Promise<boolean> {
    const wordDocument = await this.findById(wordId);

    const wordsToCompareWith = [
      wordDocument.word,
      ...wordDocument.similarWords,
    ];

    // Normalize the description by removing punctuation and splitting into words
    const descriptionWords = description
      .toLowerCase()
      .trim()
      .replace(/[.,!?]/g, '')
      .split(/\s+/);

    // Check if any word from the list is present in the description
    for (const word of wordsToCompareWith) {
      for (const descWord of descriptionWords) {
        const isSimilar = await this.compareWords(word, descWord);
        if (isSimilar) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Compares two words for similarity based on exact match, stemming, and Levenshtein distance.
   *
   * @param word1 - The first word to compare.
   * @param word2 - The second word to compare.
   * @returns A promise that resolves to a boolean indicating if the words are considered similar.
   */
  private async compareWords(word1: string, word2: string): Promise<boolean> {
    const wordToCheck1 = word1.toLowerCase().trim();
    const wordToCheck2 = word2.toLowerCase().trim();

    // Check for exact match
    if (wordToCheck1 === wordToCheck2) return true;

    // Use a stemming algorithm to compare root forms of the words
    const stemmer = natural.PorterStemmer;
    const root1 = stemmer.stem(wordToCheck1);
    const root2 = stemmer.stem(wordToCheck2);

    if (root1 === root2) return true;

    // Calculate Levenshtein distance for further comparison
    const distance = levenshtein.get(wordToCheck1, wordToCheck2);

    // Define a threshold for similarity
    const threshold = 1;
    if (distance <= threshold) return true;

    return false;
  }
}
