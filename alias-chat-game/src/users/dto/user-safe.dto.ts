import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UserSafeDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'User ID is required' })
  readonly userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  @IsNumber()
  @IsInt()
  readonly score: number;

  @IsNumber()
  @IsInt()
  readonly played: number;

  @IsNumber()
  @IsInt()
  readonly wins: number;
}
