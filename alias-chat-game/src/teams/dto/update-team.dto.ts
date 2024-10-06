import {
  IsOptional,
  IsArray,
  IsMongoId,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each player must be a valid user ID' })
  players?: Types.ObjectId[];

  @IsOptional()
  @IsMongoId({ message: 'Describer must be a valid user ID' })
  describer?: Types.ObjectId;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId({ message: 'Team leader must be a valid user ID' })
  teamLeader?: Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'Selected word must be a valid word ID' })
  selectedWord?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each word must be a valid word ID' })
  tryedWords?: Types.ObjectId[];

  @IsOptional()
  @IsBoolean()
  success?: boolean;

  @IsOptional()
  @IsString()
  answer?: string;
}
