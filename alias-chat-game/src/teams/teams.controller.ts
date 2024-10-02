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

@Controller('rooms/:roomId/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Add a team to a room
  @Post() // api/v1/rooms/{roomId}/teams
  create(
    @Param('roomId') roomId: string,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.teamsService.create(roomId, createTeamDto);
  }

  // Get all teams in a room
  @Get() // api/v1/rooms/{roomId}/teams
  findAllTeams(@Param('roomId') roomId: string) {
    return this.teamsService.findAll(roomId);
  }

  // Get a specific team by ID
  @Get(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  findOneTeam(
    @Param('roomId') roomId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.teamsService.findOne(roomId, teamId);
  }

  // Update a team by ID
  @Put(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  updateTeam(
    @Param('roomId') roomId: string,
    @Param('teamId') teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(roomId, teamId, updateTeamDto);
  }

  // Delete a team by ID
  @Delete(':teamId') // api/v1/rooms/{roomId}/teams/{teamId}
  removeTeam(@Param('roomId') roomId: string, @Param('teamId') teamId: string) {
    return this.teamsService.remove(roomId, teamId);
  }

  // Get all players in a team
  @Get(':teamId/players') // api/v1/rooms/{roomId}/teams/{teamId}/players
  findAllTeamPlayers(
    @Param('roomId') roomId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.teamsService.findAllTeamPlayers(roomId, teamId);
  }

  // Add a player to a team
  @Post(':teamId/players/:userId') // api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}
  addPlayer(
    @Param('roomId') roomId: string,
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamsService.addPlayer(roomId, teamId, userId);
  }

  // Remove a player from a team
  @Delete(':teamId') // /api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}
  removePlayer(
    @Param('roomId') roomId: string,
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamsService.removePlayer(roomId, teamId, userId);
  }

  // Define a describer and leader in one round
  @Put(':teamId/describerAndLeader') //api/v1/rooms/{roomId}/teams/{teamId}/describerAndLeader
  defineDescriberAndLeader(
    @Param('roomId') roomId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.teamsService.defineDescriberAndLeader(roomId, teamId);
  }
}
