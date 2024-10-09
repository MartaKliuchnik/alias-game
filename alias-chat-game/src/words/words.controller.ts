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
import { TeamsService } from '../teams/teams.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './schemas/word.schema';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/gurards/auth.guard';
import { ParseObjectIdPipe } from '../parse-id.pipe';

/**
 * Controller for handling word-related operations.
 * It supports creating, retrieving, updating, deleting words, and additional
 * functionality like random word selection, checking answers, and descriptions.
 */
@Controller('words')
export class WordsController {
  constructor(
    /**
     * Service for handling the business logic related to words.
     */
    private readonly wordsService: WordsService,
    /**
     * Service for handling team-related operations, used in conjunction with word features.
     */
    private readonly teamsService: TeamsService,
  ) {}

  /**
   * Endpoint for creating a new word.
   * POST /api/v1/words
   * @param {CreateWordDto} createWordDto - Data for creating the word.
   * @returns {Promise<Word>} - The newly created word.
   */
  @Post()
  create(@Body() createWordDto: CreateWordDto): Promise<Word> {
    return this.wordsService.create(createWordDto);
  }

  /**
   * Endpoint to retrieve all words.
   * GET /api/v1/words
   * @returns {Promise<Word[]>} - List of all words.
   */
  @Get()
  findAll(): Promise<Word[]> {
    return this.wordsService.findAll();
  }

  /**
   * Endpoint to retrieve a specific word by ID.
   * GET /api/v1/words/:id
   * @param {Types.ObjectId} id - ID of the word to retrieve.
   * @returns {Promise<Word>} - The requested word.
   */
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId): Promise<Word> {
    return this.wordsService.findOne(id);
  }

  /**
   * Endpoint to update a specific word by ID.
   * PATCH /api/v1/words/:id
   * @param {Types.ObjectId} id - ID of the word to update.
   * @param {UpdateWordDto} updateWordDto - Data for updating the word.
   * @returns {Promise<Word>} - The updated word.
   */
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateWordDto: UpdateWordDto,
  ): Promise<Word> {
    return this.wordsService.update(id, updateWordDto);
  }

  /**
   * Endpoint to delete a specific word by ID.
   * DELETE /api/v1/words/:id
   * @param {Types.ObjectId} id - ID of the word to delete.
   * @returns {Promise<{ message: string }>} - Confirmation message on successful deletion.
   */
  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<{ message: string }> {
    return this.wordsService.remove(id);
  }

  /**
   * Endpoint to get a random word for a team in a specific room.
   * POST /api/v1/words/random
   * Protected by AuthGuard, ensuring the user is authenticated.
   * @param {Types.ObjectId} roomId - ID of the room.
   * @param {Types.ObjectId} teamId - ID of the team.
   * @param {any} request - Request object to extract user details (JWT payload).
   * @returns {Promise<{ word: Word; tryedWords: Types.ObjectId[] }>} - Random word and list of tried words.
   */
  @Post('random')
  @UseGuards(AuthGuard)
  async getRandomWord(
    @Body('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Body('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
    @Req() request: any, // Get the request to access JWT payload
  ): Promise<{ word: Word; tryedWords: Types.ObjectId[] }> {
    return this.wordsService.getRandomWord(roomId, teamId, request.userId);
  }

  /**
   * Endpoint to check if the provided answer is correct for a given word.
   * POST /api/v1/words/:id/check-answer
   * @param {Types.ObjectId} wordId - ID of the word.
   * @param {string} answer - The user's answer to check.
   * @returns {Promise<{ correct: boolean }>} - Whether the answer is correct or not.
   */
  @Post(':id/check-answer')
  async checkAnswer(
    @Param('id', ParseObjectIdPipe) wordId: Types.ObjectId,
    @Body('answer') answer: string,
  ): Promise<{ correct: boolean }> {
    const isCorrect = await this.wordsService.checkAnswer(wordId, answer);
    return { correct: isCorrect };
  }

  /**
   * Endpoint to check if the provided description is correct for a given word.
   * POST /api/v1/words/:id/check-description
   * @param {Types.ObjectId} wordId - ID of the word.
   * @param {string} description - The user's description to check.
   * @returns {Promise<{ correct: boolean }>} - Whether the description is correct or not.
   */
  @Post(':id/check-description')
  async checkDescription(
    @Param('id', ParseObjectIdPipe) wordId: Types.ObjectId,
    @Body('description') description: string,
  ): Promise<{ correct: boolean }> {
    const isCorrect = await this.wordsService.checkDescription(
      wordId,
      description,
    );
    return { correct: isCorrect };
  }
}
