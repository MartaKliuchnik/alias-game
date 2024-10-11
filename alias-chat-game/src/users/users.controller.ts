import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSafeDto } from './dto/user-safe.dto';
import { ParseObjectIdPipe } from '../parse-id.pipe';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/gurards/auth.guard';
import { RoomsService } from '../rooms/rooms.service';
import { TeamsService } from '../teams/teams.service';

// UsersController handles CRUD operations for user management.
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService,
    private readonly teamsService: TeamsService,
  ) {}

  /**
   * @route GET /api/v1/users
   * @description Retrieve all users
   * @access Private (Authenticated user)
   */
  @Get()
  async findAll(): Promise<UserSafeDto[] | []> {
    const users = await this.usersService.getUsers();
    return users.sort((a, b) => b.score - a.score);
  }

  /**
   * @route GET /api/v1/users/{userId}
   * @description Retrieve a specified user by id
   * @access Private (Authenticated user)
   */
  @Get(':userId')
  async findOne(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<UserSafeDto | null> {
    const user = await this.usersService.getUserById(userId);
    return user;
  }

  /**
   * @route DELETE /api/v1/users/{userId}
   * @description Delete a specified user by id (supports hard/soft delete)
   * @access Private (Authenticated user)
   */
  @Delete(':userId')
  async remove(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Query('hardDelete') hardDelete: string,
  ): Promise<{ message: string }> {
    const isHardDelete = hardDelete === 'true';
    return this.usersService.removeUser(userId, isHardDelete);
  }

  /**
   * @route PATCH /api/v1/users/{userId}
   * @description Update the specified user
   * @access Private (Authenticated user)
   */
  @Patch(':userId')
  update(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserSafeDto> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  /**
   * @route POST /api/v1/users/{userId}/room/join
   * @description Add the specified user in the room
   * @access Private (Authenticated user)
   */
  @Post(':userId/room/join')
  async joinRoom(@Param('userId', ParseObjectIdPipe) userId: Types.ObjectId) {
    const room = await this.roomsService.addUserToRoom(userId);
    return room;
  }

  /**
   * @route POST /api/v1/users/{userId}/room/leave/:roomId
   * @description Remove the specified user from the room
   * @access Private (Authenticated user)
   */
  @Delete(':userId/room/leave/:roomId')
  async leaveRoom(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
  ) {
    const room = await this.roomsService.removeUserFromRoom(userId, roomId);
    return room;
  }

  /**
   * @route POST /api/v1/users/{userId}/team/join/{teamId}
   * @description Add the specified user in the team
   * @access Private (Authenticated user)
   */
  @Post(':userId/team/join/:teamId')
  async joinTeam(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
  ) {
    const team = await this.teamsService.addPlayerToTeam(userId, teamId);
    const isReady = await this.roomsService.isRoomReady(team.roomId);
    if (isReady) {
      this.roomsService.startGame(team.roomId);
    }
    return team;
  }

  /**
   * @route POST /api/v1/users/{userId}/team/leave/{teamId}
   * @description Remove the specified user from the team
   * @access Private (Authenticated user)
   */
  @Delete(':userId/team/leave/:teamId')
  async leaveTeam(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
  ) {
    const team = await this.teamsService.removePlayerFromTeam(userId, teamId);
    return team;
  }
}
