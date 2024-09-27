import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsMongoId,
  ArrayMinSize,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateTeamDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'Room ID is required' })
  roomId: Types.ObjectId;

  @IsString()
  @IsNotEmpty({ message: 'Team name is required' })
  name: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'There must be at least 2 players' })
  @IsMongoId({ each: true, message: 'Each player must be a valid user ID' })
  players: Types.ObjectId[];
}
