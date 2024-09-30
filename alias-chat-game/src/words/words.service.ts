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

@Injectable()
export class WordsService {
  constructor(@InjectModel(Word.name) private wordModel: Model<WordDocument>) {}

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
}
