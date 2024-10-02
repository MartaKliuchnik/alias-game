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
  // eslint-disable-next-line prettier/prettier
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

  /**
   * This method defines both the next describer and team leader for the given team in a room.
   * If the describer is not yet defined, the first player in the array will be selected as the describer,
   * and the second player as the team leader. After that, it cycles through the players.
   *
   * @param roomId - The ID of the room where the team is located.
   * @param teamId - The ID of the team for which to define the next describer and leader.
   * @returns The updated team with new describer and leader.
   */
  async defineDescriberAndLeader(roomId: string, teamId: string) {
    const team = await this.teamModel.findOne({ _id: teamId, roomId }).exec();

    if (!team) {
      throw new NotFoundException(`Team ${teamId} in room ${roomId} not found`);
    }

    const { players, describer } = team;

    // If describer is not yet set (first round), start with the first player as describer.
    const currentDescriberIndex = describer ? players.indexOf(describer) : -1;

    // Determine the next describer index: if no describer yet, start at 0 (first player).
    const nextDescriberIndex = (currentDescriberIndex + 1) % players.length;
    const nextDescriber = players[nextDescriberIndex];

    // Determine the next team leader index: the player after the next describer.
    const nextLeaderIndex = (nextDescriberIndex + 1) % players.length;
    const nextLeader = players[nextLeaderIndex];

    await this.setDescriber(roomId, teamId, { userId: nextDescriber });
    return this.setTeamLeader(roomId, teamId, { userId: nextLeader });
  }

  private async setDescriber(
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

  private async setTeamLeader(
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
