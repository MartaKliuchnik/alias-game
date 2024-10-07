import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ParseObjectIdPipe } from 'src/parse-id.pipe';
import { Types } from 'mongoose';

/**
 * Controller for handling room-related requests.
 * Handles routes for creating, updating, retrieving, and deleting rooms.
 */
@Controller('rooms')
export class RoomsController {
  constructor(
    /**
     * Rooms service for handling business logic related to rooms.
     */
    private readonly roomsService: RoomsService,
  ) {}

  /**
   * Endpoint for creating a new room.
   * POST /api/v1/rooms
   * @param {CreateRoomDto} createRoomDto Request body with room's data.
   * @returns {Promise<any>} The newly created room.
   */
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  /**
   * Endpoint for updating a specific room by ID.
   * PATCH /api/v1/rooms/{id}
   * @param {Types.ObjectId} id The ID of the room to update.
   * @param {UpdateRoomDto} updateRoomDto Request body with room's updated data.
   * @returns {Promise<any>} The updated room.
   */
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  /**
   * Endpoint for retrieving all rooms.
   * GET /api/v1/rooms
   * @returns {Promise<any[]>} A list of all rooms.
   */
  @Get()
  async findAll() {
    return this.roomsService.findAll();
  }

  /**
   * Endpoint for retrieving a specific room by ID.
   * GET /api/v1/rooms/{id}
   * @param {Types.ObjectId} id The ID of the room to retrieve.
   * @returns {Promise<any>} The requested room.
   */
  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.roomsService.findOne(id);
  }

  /**
   * Endpoint for deleting a specific room by ID.
   * DELETE /api/v1/rooms/{id}
   * @param {Types.ObjectId} id The ID of the room to delete.
   * @returns {Promise<void>} No content on success.
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.roomsService.delete(id);
  }
<<<<<<< HEAD
=======

  /**
   * Endpoint for calculating scores for all teams and players in a specific room.
   * PATCH /api/v1/rooms/{roomId}/calculate-scores
   * @param {Types.ObjectId} roomId The ID of the room for score calculation.
   * @returns {Promise<{ message: string }>} A message indicating success.
   */
  @Patch(':roomId/calculate-scores')
  async calculateScores(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
  ) {
    return this.roomsService.calculateScores(roomId);
  }
>>>>>>> origin/pre-prod

  /**
   * Endpoint for deleting all rooms.
   * DELETE /api/v1/rooms
   * @returns {Promise<{ message: string }>} A message indicating success.
   */
  @Delete()
  async deleteAllRooms(): Promise<{ message: string }> {
    return this.roomsService.deleteAllRooms();
  }
}
