import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SetDescriberDto } from './dto/set-describer.dto';
import { SetTeamLeaderDto } from './dto/set-team-leader.dto';
import { Types } from 'mongoose';

@Controller('teams')
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
  findAllTeams(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.teamsService.findAll(roomId);
  }

  // Get a specific team by ID
  @Get(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  findOneTeam(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.teamsService.findOne(roomId, teamId);
  }

  // Update a team by ID
  @Put(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  updateTeam(
    @Param('teamId') teamId: Types.ObjectId,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(teamId, updateTeamDto);
  }

  // Delete a team by ID
  @Delete(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  removeTeam(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.teamsService.remove(roomId, teamId);
  }

  // Get all players in a team
  @Get(':teamId/players') // api/v1/rooms/{roomId}/teams/{teamId}/players
  findAllTeamPlayers(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.teamsService.findAllTeamPlayers(roomId, teamId);
  }

  // Remove a player from a team
  @Delete(':teamId') // /api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}
  removePlayer(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.teamsService.removePlayer(roomId, teamId, userId);
  }

  // Set a player as the team describer
  @Put(':teamId/describer') // PUT /api/v1/rooms/{roomId}/teams/{teamId}/describer
  setDescriber(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() setDescriberDto: SetDescriberDto,
  ) {
    return this.teamsService.setDescriber(roomId, teamId, setDescriberDto);
  }

  // Set a player as the team leader
  @Put(':teamId/teamLeader') // PUT /api/v1/rooms/{roomId}/teams/{teamId}/describer
  setTeamLeader(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() setTeamLeaderDto: SetTeamLeaderDto,
  ) {
    return this.teamsService.setTeamLeader(roomId, teamId, setTeamLeaderDto);
  }
}
