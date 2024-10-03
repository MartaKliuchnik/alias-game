import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { TeamsService } from 'src/teams/teams.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './schemas/word.schema';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/gurards/auth.guard';

@Controller('words')
export class WordsController {
  // eslint-disable-next-line prettier/prettier
  constructor(
    private readonly wordsService: WordsService,
    private readonly teamsService: TeamsService,
  ) {}

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

  @Post('random')
  @UseGuards(AuthGuard)
  async getRandomWord(
    @Body('roomId') roomId: string,
    @Body('teamId') teamId: string,
    @Req() request: any, // Get the request to access JWT payload
  ): Promise<{ word: Word; tryedWords: string[] }> {
    return this.wordsService.getRandomWord(roomId, teamId, request.userId);
  }

  @Post(':id/check-answer')
  async checkAnswer(
    @Param('id') wordId: Types.ObjectId,
    @Body('answer') answer: string,
  ): Promise<{ correct: boolean }> {
    const isCorrect = await this.wordsService.checkAnswer(wordId, answer);
    return { correct: isCorrect };
  }

  @Post(':id/check-description')
  async checkDescription(
    @Param('id') wordId: Types.ObjectId,
    @Body('description') description: string,
  ): Promise<{ correct: boolean }> {
    const isCorrect = await this.wordsService.checkDescription(
      wordId,
      description,
    );
    return { correct: isCorrect };
  }
}
