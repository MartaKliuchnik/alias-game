import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  @IsNotEmpty()
  roomId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  @IsNotEmpty()
  teamId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  text: string;
}
