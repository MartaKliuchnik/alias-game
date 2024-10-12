import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { CreateRoomDto } from '../rooms/dto/create-room.dto';
import { CreateTeamDto } from '../teams/dto/create-team.dto';
import { RoomsService } from '../rooms/rooms.service';
import { TeamsService } from '../teams/teams.service';
import { WordsService } from '../words/words.service';
import { CreateWordDto } from '../words/dto/create-word.dto';

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly teamsService: TeamsService,
    private readonly configService: ConfigService,
    private readonly wordsService: WordsService,
  ) {}

  /**
   * Lifecycle hook that is called when the module is initialized.
   * It triggers the creation of default rooms with teams and words if they do not exist.
   */
  async onModuleInit() {
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      // Cleanup for development environment
      await this.teamsService.deleteAllTeams();
      await this.roomsService.deleteAllRooms();
    }

    await this.createDefaultRooms();
    await this.createWords();
  }

  /**
   * Creates default rooms if they do not already exist in the database.
   */
  private async createDefaultRooms() {
    const initialRooms: CreateRoomDto[] = [
      { name: 'Room1', teams: [], turnTime: 60 },
      { name: 'Room2', teams: [], turnTime: 60 },
    ];

    for (const room of initialRooms) {
      const existingRoom = await this.roomsService.findAll();
      const roomExist = existingRoom.some(
        (existing) => existing.name === room.name,
      );

      if (!roomExist) {
        const createdRoom = await this.roomsService.create(room);
        await this.addTeamsToRoom(createdRoom._id);
      }
    }
  }

  /**
   * Adds default teams to a specified room.
   * The default teams created are Team1 and Team2, each initialized with an empty players array.
   * @param {Types.ObjectId} roomId - The ID of the room to which teams will be added.
   */
  private async addTeamsToRoom(roomId: Types.ObjectId) {
    const teams: (CreateTeamDto & { roomId: Types.ObjectId })[] = [
      { roomId, name: 'Team1', players: [] },
      { roomId, name: 'Team2', players: [] },
    ];

    const teamIds: Types.ObjectId[] = [];

    for (const team of teams) {
      const createdTeam = await this.teamsService.create(roomId, team);
      teamIds.push(createdTeam._id);
    }

    await this.roomsService.updateTeam(roomId, teamIds);
  }

  /**
   * Initializes the default set of words if none exist in the database.
   */
  private async createWords() {
    const existingWords = await this.wordsService.findAll();
    if (existingWords.length === 0) {
      const words: CreateWordDto[] = [
        {
          word: 'bicycle',
          similarWords: ['bike', 'cycle'],
        },
        {
          word: 'garden',
          similarWords: ['lawn', 'yard'],
        },
        {
          word: 'airplane',
          similarWords: ['plane'],
        },
        {
          word: 'computer',
          similarWords: ['laptop', 'pc'],
        },
        {
          word: 'mountain',
          similarWords: ['peak', 'massif'],
        },
        {
          word: 'teacher',
          similarWords: [
            'educator',
            'professor',
            'tutor',
            'lecturer',
            'pedagogue',
          ],
        },
        {
          word: 'window',
          similarWords: ['aperture', 'opening'],
        },
        {
          word: 'candle',
          similarWords: ['taper', 'wax', 'light'],
        },
        {
          word: 'piano',
          similarWords: ['grand', 'keyboard'],
        },
        {
          word: 'bridge',
          similarWords: ['link', 'overpass', 'platform'],
        },
      ];

      for (const word of words) {
        try {
          await this.wordsService.create(word);
        } catch (error) {
          console.error(`Failed to create word '${word.word}':`, error.message);
        }
      }
    }
  }
}
