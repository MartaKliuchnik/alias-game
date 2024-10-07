import {
  IsOptional,
  IsArray,
  IsMongoId,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';

/**
 * DTO for updating a team.
 */
export class UpdateTeamDto {
  /**
   * Team's name
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Array of IDs of players
   */
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each player must be a valid user ID' })
  players?: Types.ObjectId[];

  /**
   * Describer's ID
   */
  @IsOptional()
  @IsMongoId({ message: 'Describer must be a valid user ID' })
  describer?: Types.ObjectId;

  /**
   * Description of the word made by describer
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Team leader's ID
   */
  @IsOptional()
  @IsMongoId({ message: 'Team leader must be a valid user ID' })
  teamLeader?: Types.ObjectId;

  /**
   * Selected word's ID
   */
  @IsOptional()
  @IsMongoId({ message: 'Selected word must be a valid word ID' })
  selectedWord?: Types.ObjectId;

  /**
   * Array of tryed words' IDs
   */
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each word must be a valid word ID' })
  tryedWords?: Types.ObjectId[];

<<<<<<< HEAD
=======
  /**
   * Boolean value of word guess' ressult
   */
>>>>>>> pre-prod
  @IsOptional()
  @IsBoolean()
  success?: boolean;

<<<<<<< HEAD
=======
  /**
   * Answer made by team leader
   */
>>>>>>> pre-prod
  @IsOptional()
  @IsString()
  answer?: string;
}
