import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './schemas/word.schema';
import { Types } from 'mongoose';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  create(@Body() createWordDto: CreateWordDto): Promise<Word> {
    return this.wordsService.create(createWordDto);
  }

  @Get()
  findAll(): Promise<Word[]> {
    return this.wordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId): Promise<Word> {
    return this.wordsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateWordDto: UpdateWordDto,
  ): Promise<Word> {
    return this.wordsService.update(id, updateWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId): Promise<{ message: string }> {
    return this.wordsService.remove(id);
  }
}
