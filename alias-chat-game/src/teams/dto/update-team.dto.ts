import { IsOptional, IsArray, IsMongoId, IsString } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each player must be a valid user ID' })
  player?: string[];

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
