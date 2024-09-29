import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from './schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SetDescriberDto } from './dto/set-describer.dto';
import { SetTeamLeaderDto } from './dto/set-team-leader.dto';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  create(roomId: number, createTeamDto: CreateTeamDto) {
    return `This action adds a team to a ${roomId}room`;
  }

  findAll(roomId: number) {
    return `This action returns all teams in ${roomId} room`;
  }

  findOne(roomId: number, teamId: number) {
    return `This action returns a #${teamId} team in ${roomId} room`;
  }

  update(roomId: number, teamId: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${teamId} team in ${roomId} room`;
  }

  remove(roomId: number, teamId: number) {
    return `This action removes a #${teamId} team from ${roomId} room`;
  }

  findAllTeamPlayers(roomId: number, teamId: number) {
    return `This action returns all players in ${teamId} team in ${roomId} room`;
  }

  addPlayer(roomId: number, teamId: number, userId: number) {
    return `This action adds a #${userId} user in #${teamId} team in ${roomId} room`;
  }

  removePlayer(roomId: number, teamId: number, userId: number) {
    return `This action removes a #${userId} user in #${teamId} team from ${roomId} room`;
  }

  setDescriber(
    roomId: number,
    teamId: number,
    setDescriberDto: SetDescriberDto,
  ) {
    return `This action sets user as the describer in team #${teamId} in room #${roomId}`;
  }

  setTeamLeader(
    roomId: number,
    teamId: number,
    setTeamLeaderDto: SetTeamLeaderDto,
  ) {
    return `This action sets user as the leader of team #${teamId} in room #${roomId}`;
  }
}
