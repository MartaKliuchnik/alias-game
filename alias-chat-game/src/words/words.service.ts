import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Word } from './schemas/word.schema';

import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';

@Injectable()
export class WordsService {
  constructor(@InjectModel(Word.name) private wordModel: Model<Word>) {}

  // POST http://localhost:8080/api/v1/words
  async create(createWordDto: CreateWordDto): Promise<Word> {
    const createdWord = new this.wordModel(createWordDto);
    return createdWord.save();
  }

  // GET /api/v1/words
  async findAll(): Promise<Word[]> {
    return this.wordModel.find().exec();
  }

  // GET /api/v1/words/:id
  async findOne(id: string): Promise<Word> {
    return this.wordModel.findById(id).exec();
  }

  // PATCH /api/v1/words/:id
  async update(id: string, updateWordDto: UpdateWordDto): Promise<Word> {
    return this.wordModel
      .findByIdAndUpdate(id, updateWordDto, { new: true })
      .exec();
  }

  // DELETE /api/v1/words/:id
  async remove(id: string): Promise<Word> {
    return this.wordModel.findByIdAndDelete(id).exec();
  }
}
