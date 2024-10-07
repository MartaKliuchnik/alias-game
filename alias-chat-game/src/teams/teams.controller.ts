import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { UsersService } from 'src/users/users.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ParseObjectIdPipe } from 'src/parse-id.pipe';
import { Types } from 'mongoose';

/**
 * Controller for handling team-related operations within rooms.
 */
@Controller('rooms/:roomId/teams')
export class TeamsController {
  constructor(
    /**
     * Service for managing teams.
     */
    private readonly teamsService: TeamsService,

    /**
     * Service for managing users.
     */
    private readonly usersService: UsersService,
  ) {}

  /**
   * Endpoint method for creating a new team in a room.
   * POST /api/v1/rooms/{roomId}/teams
   * @param {Types.ObjectId} roomId ID of the room where the team will be created.
   * @param {CreateTeamDto} createTeamDto Request body containing the team's data.
   * @returns Created team object.
   */
  @Post()
  create(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.teamsService.create(roomId, createTeamDto);
  }

  /**
   * Endpoint method for retrieving all teams in a room.
   * GET /api/v1/rooms/{roomId}/teams
   * @param {Types.ObjectId} roomId ID of the room.
   * @param {boolean} [nestUsers=false] Whether to nest user details within the teams.
   * @returns List of teams in the room.
   */
  @Get()
  findAllTeams(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Query('nestUsers') nestUsers: boolean = false,
  ) {
    return this.teamsService.findAll(roomId, nestUsers);
  }

  /**
   * Endpoint method for deleting all teams in a room.
   * DELETE /api/v1/rooms/{roomId}/teams
   * @param {Types.ObjectId} roomId ID of the room.
   * @returns Message indicating the result of deletion.
   */
  @Delete()
  async deleteAllTeams(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
  ): Promise<{ message: string }> {
    return await this.teamsService.deleteAllTeamsFromRoom(roomId);
  }

  /**
   * Endpoint method for retrieving a specific team by ID.
   * GET /api/v1/rooms/{roomId}/teams/{teamId}
   * @param {Types.ObjectId} roomId ID of the room.
   * @param {Types.ObjectId} teamId ID of the team.
   * @returns The team object.
   */
  @Get(':teamId')
  findOneTeam(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
  ) {
    return this.teamsService.findOne(roomId, teamId);
  }

  /**
   * Endpoint method for updating a team's details by ID.
   * PUT /api/v1/rooms/{roomId}/teams/{teamId}
   * @param {Types.ObjectId} roomId ID of the room.
   * @param {Types.ObjectId} teamId ID of the team.
   * @param {UpdateTeamDto} updateTeamDto Request body containing updated team data.
   * @returns Updated team object.
   */
  @Put(':teamId')
  updateTeam(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(teamId, updateTeamDto);
  }

  /**
   * Endpoint method for deleting a specific team by ID.
   * DELETE /api/v1/rooms/{roomId}/teams/{teamId}
   * @param {Types.ObjectId} roomId ID of the room.
   * @param {Types.ObjectId} teamId ID of the team.
   * @returns Message indicating the result of deletion.
   */
  @Delete(':teamId')
  removeTeam(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
  ) {
    return this.teamsService.remove(roomId, teamId);
  }

  /**
   * Endpoint method for retrieving all players in a team.
   * GET /api/v1/rooms/{roomId}/teams/{teamId}/players
   * @param {Types.ObjectId} roomId ID of the room.
   * @param {Types.ObjectId} teamId ID of the team.
   * @returns List of players in the team, sorted by score.
   */
  @Get(':teamId/players')
  async findAllTeamPlayers(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
  ) {
    const playerIds = await this.teamsService.findAllTeamPlayers(
      roomId,
      teamId,
    );

    const players = await Promise.all(
      playerIds.map(async (id: Types.ObjectId) => {
        const player = await this.usersService.getUserById(id);
        return player;
      }),
    );
    return players.sort((a, b) => b.score - a.score);
  }

  /**
   * Endpoint method for adding a player to a team.
   * POST /api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}
   * @param {Types.ObjectId} teamId ID of the team.
   * @param {Types.ObjectId} userId ID of the user.
   * @returns Updated team object.
   */
  @Post(':teamId/players/:userId')
  addPlayer(
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this.teamsService.addPlayerToTeam(userId, teamId);
  }

  /**
   * Endpoint method for removing a player from a team.
   * DELETE /api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}
   * @param {Types.ObjectId} roomId ID of the room.
   * @param {Types.ObjectId} teamId ID of the team.
   * @param {Types.ObjectId} userId ID of the user.
   * @returns Updated team object.
   */
  @Delete(':teamId/players/:userId')
  removePlayer(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this.teamsService.removePlayer(roomId, teamId, userId);
  }

  /**
   * Endpoint method for defining the describer and leader roles for a round.
   * PUT /api/v1/rooms/{roomId}/teams/{teamId}/roles
   * @param {Types.ObjectId} roomId ID of the room.
   * @param {Types.ObjectId} teamId ID of the team.
   * @returns Updated team object.
   */
  @Put(':teamId/roles')
  defineDescriberAndLeader(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
  ) {
    return this.teamsService.defineDescriberAndLeader(roomId, teamId);
  }

  /**
   * Endpoint method for resetting the round fields to null for a team.
   * PUT /api/v1/rooms/{roomId}/teams/{teamId}/reset
   * @param {Types.ObjectId} roomId ID of the room.
   * @param {Types.ObjectId} teamId ID of the team.
   * @returns Updated team object with reset fields.
   */
  @Put(':teamId/reset')
  resetRound(
    @Param('roomId', ParseObjectIdPipe) roomId: Types.ObjectId,
    @Param('teamId', ParseObjectIdPipe) teamId: Types.ObjectId,
  ) {
    return this.teamsService.resetRound(roomId, teamId);
  }
}
