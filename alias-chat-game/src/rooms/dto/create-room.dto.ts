import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  teams: string[];

  // TODO check int validation !!!
  @IsInt()
  @Min(15)
  @Max(250)
  turnTime: number;
}
