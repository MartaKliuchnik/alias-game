import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from './schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SetDescriberDto } from './dto/set-describer.dto';
import { SetTeamLeaderDto } from './dto/set-team-leader.dto';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) { }

  async create(roomId: string, createTeamDto: CreateTeamDto): Promise<Team> {
    const createdTeam = new this.teamModel({ ...createTeamDto, roomId });
    return createdTeam.save();
  }

  findAll(roomId: string) {
    return this.teamModel.find({ roomId }).exec();
  }

  async findOne(roomId: string, teamId: string) {
    const team = await this.teamModel.findOne({ _id: teamId, roomId }).exec();
    if (!team) {
      throw new NotFoundException(`Team ${teamId} in room ${roomId} not found`);
    }
    return team;
  }

  async update(roomId: string, teamId: string, updateTeamDto: UpdateTeamDto) {
    const updatedTeam = await this.teamModel
      .findOneAndUpdate({ _id: teamId, roomId }, updateTeamDto, { new: true })
      .exec();

    if (!updatedTeam) {
      throw new NotFoundException(`Team ${teamId} in room ${roomId} not found`);
    }

    return updatedTeam;
  }

  async remove(roomId: string, teamId: string) {
    const result = await this.teamModel
      .deleteOne({ _id: teamId, roomId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Team ${teamId} in room ${roomId} not found`);
    }
  }

  async findAllTeamPlayers(roomId: string, teamId: string) {
    const team = await this.findOne(roomId, teamId);
    return team.players;
  }

  async addPlayer(roomId: string, teamId: string, userId: string) {
    const team = await this.teamModel
      .findOneAndUpdate(
        { _id: teamId, roomId },
        { $addToSet: { players: userId } },
        { new: true },
      )
      .exec();

    if (!team) {
      throw new NotFoundException(`Team ${teamId} in room ${roomId} not found`);
    }

    return team;
  }

  async removePlayer(roomId: string, teamId: string, userId: string) {
    const team = await this.teamModel
      .findOneAndUpdate(
        { _id: teamId, roomId },
        { $pull: { players: userId } },
        { new: true },
      )
      .exec();

    if (!team) {
      throw new NotFoundException(`Team ${teamId} in room ${roomId} not found`);
    }

    return team;
  }

  async setDescriber(
    roomId: string,
    teamId: string,
    setDescriberDto: SetDescriberDto,
  ) {
    const team = await this.teamModel
      .findOneAndUpdate(
        { _id: teamId, roomId },
        { describer: setDescriberDto.userId },
        { new: true },
      )
      .exec();

    if (!team) {
      throw new NotFoundException(`Team ${teamId} in room ${roomId} not found`);
    }

    return team;
  }

  async setTeamLeader(
    roomId: string,
    teamId: string,
    setTeamLeaderDto: SetTeamLeaderDto,
  ) {
    const team = await this.teamModel
      .findOneAndUpdate(
        { _id: teamId, roomId },
        { teamLeader: setTeamLeaderDto.userId },
        { new: true },
      )
      .exec();

    if (!team) {
      throw new NotFoundException(`Team ${teamId} in room ${roomId} not found`);
    }

    return team;
  }
}
