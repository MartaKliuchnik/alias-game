import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for refreshing user's access token
 */
export class RefreshTokenDto {
  /**
   * User's refresh token.
   */
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
