
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class SetTeamLeaderDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'User ID for team leader is required' })
  userId: Types.ObjectId;
}

