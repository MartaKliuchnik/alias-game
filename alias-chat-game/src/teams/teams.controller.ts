import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  //ParseIntPipe,
  Put,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Types } from 'mongoose';

@Controller('rooms/:roomId/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Add a team to a room
  @Post() // api/v1/rooms/{roomId}/teams
  create(
    @Param('roomId') roomId: Types.ObjectId,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.teamsService.create(roomId, createTeamDto);
  }

  // Get all teams in a room
  @Get() // api/v1/rooms/{roomId}/teams
  findAllTeams(@Param('roomId') roomId: Types.ObjectId) {
    return this.teamsService.findAll(roomId);
  }

  // Get a specific team by ID
  @Get(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  findOneTeam(
    @Param('roomId') roomId: Types.ObjectId,
    @Param('teamId') teamId: Types.ObjectId,
  ) {
    return this.teamsService.findOne(roomId, teamId);
  }

  // Update a team by ID
  @Put(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  updateTeam(
    @Param('roomId') roomId: Types.ObjectId,
    @Param('teamId') teamId: Types.ObjectId,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(teamId, updateTeamDto);
  }

  // Delete a team by ID
  @Delete(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  removeTeam(
    @Param('roomId') roomId: Types.ObjectId,
    @Param('teamId') teamId: Types.ObjectId,
  ) {
    return this.teamsService.remove(roomId, teamId);
  }

  // Get all players in a team
  @Get(':teamId/players') // api/v1/rooms/{roomId}/teams/{teamId}/players
  findAllTeamPlayers(
    @Param('roomId') roomId: Types.ObjectId,
    @Param('teamId') teamId: Types.ObjectId,
  ) {
    return this.teamsService.findAllTeamPlayers(roomId, teamId);
  }

  // Add a player to a team
  @Post(':teamId/players/:userId') // api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}
  addPlayer(
    @Param('roomId') roomId: Types.ObjectId,
    @Param('teamId') teamId: Types.ObjectId,
    @Param('userId') userId: Types.ObjectId,
  ) {
    return this.teamsService.addPlayerToTeam(userId, teamId);
  }

  // Remove a player from a team
  @Delete(':teamId') // /api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}
  removePlayer(
    @Param('roomId') roomId: Types.ObjectId,
    @Param('teamId') teamId: Types.ObjectId,
    @Param('userId') userId: Types.ObjectId,
  ) {
    return this.teamsService.removePlayer(roomId, teamId, userId);
  }

  // Define a describer and leader in one round
  @Put(':teamId/roles') //api/v1/rooms/{roomId}/teams/{teamId}/roles
  defineDescriberAndLeader(
    @Param('roomId') roomId: Types.ObjectId,
    @Param('teamId') teamId: Types.ObjectId,
  ) {
    return this.teamsService.defineDescriberAndLeader(roomId, teamId);
  }
}
