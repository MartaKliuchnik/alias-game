import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsMongoId,
  ArrayMinSize,
} from 'class-validator';
import { Types } from 'mongoose';

/**
 * DTO for creating a new team.
 */
export class CreateTeamDto {
  /**
   * Team's name.
   */
  @IsString()
  @IsNotEmpty({ message: 'Team name is required' })
  name: string;

  /**
   * Array of players' IDs.
   */
  @IsArray()
  @ArrayMinSize(2, { message: 'There must be at least 2 players' })
  @IsMongoId({ each: true, message: 'Each player must be a valid user ID' })
  players: Types.ObjectId[];
}
