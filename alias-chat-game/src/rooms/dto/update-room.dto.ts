import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { Types } from 'mongoose';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

/**
 * DTO for updating a room.
 */
export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  /**
   * An array of joined users' IDs.
   */
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  joinedUsers: Types.ObjectId[];
}
