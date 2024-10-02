import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team } from './schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SetDescriberDto } from './dto/set-describer.dto';
import { SetTeamLeaderDto } from './dto/set-team-leader.dto';

@Injectable()
export class TeamsService {
  private readonly MAX_USERS_IN_TEAM = 3;
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  /**
   * Creates a new team within a specified room.
   * @param {Types.ObjectId} roomId - The ID of the room where the team will be created.
   * @param {CreateTeamDto} createTeamDto - The data transfer object containing the details of the team to be created.
   * @returns {Promise<TeamDocument>} - The newly created team document.
   * @throws {InternalServerErrorException} - If an error occurs during the database operation.
   */
  create(roomId: Types.ObjectId, createTeamDto: CreateTeamDto) {
    const team = new this.teamModel({ ...createTeamDto, roomId });
    return team.save();
  }

  /**
   * Retrieves a team by its ID.
   * @param {Types.ObjectId} teamId - The ID of the team to retrieve.
   * @returns {Promise<TeamDocument | null>} - The team document if found, or null if not found.
   * @throws {NotFoundException} - If the specified team is not found.
   */
  async findTeamById(teamId: Types.ObjectId) {
    return await this.teamModel.findById(teamId);
  }

  /**
   * Adds a user to a specified team. If the team is full, an error is thrown.
   * @param {Types.ObjectId} userId - The ID of the user to be added to the team.
   * @param {Types.ObjectId} teamId - The ID of the team to which the user will be added.
   * @returns {Promise<Object>} - An object containing a success message, the room ID, and the team ID.
   * @throws {NotFoundException} - If the specified team is not found.
   * @throws {BadRequestException} - If the team is already full.
   */
  async addPlayerToTeam(userId: Types.ObjectId, teamId: Types.ObjectId) {
    const team = await this.findTeamById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    if (team.players.length >= this.MAX_USERS_IN_TEAM) {
      throw new BadRequestException('Team is already full.');
    }

    if (!team.players.includes(userId)) {
      team.players.push(userId);
      await this.update(teamId, { players: team.players });
    } else {
      throw new BadRequestException('User is already in the team.');
    }

    return {
      message: 'Player added to the team successfully.',
      roomId: team.roomId,
      teamId: team._id,
    };
  }

  /**
   * Updates a team with the given ID using the provided updateTeamDto.
   * @param {Types.ObjectId} teamId - The ID of the team to be updated.
   * @param {UpdateTeamDto} updateTeamDto - An object containing the fields to be updated.
   * @returns {Promise<TeamDocument | null>} - The updated team document, or null if the team is not found.
   */
  async update(teamId: Types.ObjectId, updateTeamDto: UpdateTeamDto) {
    return this.teamModel
      .findByIdAndUpdate(teamId, updateTeamDto, {
        new: true,
      })
      .exec();
  }

  findAll(roomId: number) {
    return `This action returns all teams in ${roomId} room`;
  }

  findOne(roomId: number, teamId: number) {
    return `This action returns a #${teamId} team in ${roomId} room`;
  }

  remove(roomId: number, teamId: number) {
    return `This action removes a #${teamId} team from ${roomId} room`;
  }

  findAllTeamPlayers(roomId: number, teamId: number) {
    return `This action returns all players in ${teamId} team in ${roomId} room`;
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
