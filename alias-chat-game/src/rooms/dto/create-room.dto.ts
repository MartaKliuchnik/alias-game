import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

/**
 * DTO for creating a new room.
 */
export class CreateRoomDto {
  /**
   * Name of the room.
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * Array of IDs of teams
   */
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  teams: string[];

  /**
   * Time for each turn in seconds
   */
  @IsInt()
  @Min(15)
  @Max(250)
  turnTime: number;
}
