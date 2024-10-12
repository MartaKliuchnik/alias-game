import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

/**
 * DTO for setting a new describer.
 */
export class SetDescriberDto {
  /**
   * Describer's ID.
   */
  @IsMongoId()
  @IsNotEmpty({ message: 'User ID for describer is required' })
  userId: Types.ObjectId;
}
