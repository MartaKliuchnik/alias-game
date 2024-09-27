import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class SetDescriberDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'User ID for describer is required' })
  userId: Types.ObjectId;
}
