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
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNumber()
  @IsInt()
  score: number;

  @IsNumber()
  @IsInt()
  played: number;

  @IsNumber()
  @IsInt()
  wins: number;
}
