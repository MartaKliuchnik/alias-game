import { IsOptional, IsArray, IsMongoId, IsString } from 'class-validator';
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
  describer?: string;

  @IsOptional()
  @IsMongoId({ message: 'Team leader must be a valid user ID' })
  teamLeader?: string;

  @IsOptional()
  @IsMongoId({ message: 'Selected word must be a valid word ID' })
  selectedWord?: string;

  @IsOptional()
  @IsArray()
  tryedWords?: string[];
}
