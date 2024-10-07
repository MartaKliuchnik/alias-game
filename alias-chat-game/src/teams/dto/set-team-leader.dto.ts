import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

/**
 * DTO for setting a team leader.
 */
export class SetTeamLeaderDto {
  /**
   * ID of team leader
   */
  @IsMongoId()
  @IsNotEmpty({ message: 'User ID for team leader is required' })
  userId: Types.ObjectId;
}
