import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

/**
 * DTO for user's data.
 */
export class UserSafeDto {
  /**
   * User's id
   */
  @IsMongoId()
  @IsNotEmpty({ message: 'User ID is required' })
  readonly userId: string;

  /**
   * User's name
   */
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  /**
   * User's score
   */
  @IsNumber()
  @IsInt()
  readonly score: number;

  /**
   * User's amount of played games
   */
  @IsNumber()
  @IsInt()
  readonly played: number;

  /**
   * User's amount of winned games
   */
  @IsNumber()
  @IsInt()
  readonly wins: number;
}
