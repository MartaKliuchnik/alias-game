import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { Types } from 'mongoose';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  joinedUsers: Types.ObjectId[];
}
