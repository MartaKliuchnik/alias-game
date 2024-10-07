import { IsString, IsNotEmpty, Length } from 'class-validator';

/**
 * DTO for user's login
 */
export class LoginDto {
  /**
   * User's name.
   */
  @IsString()
  @Length(3, 20)
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  /**
   * User's password.
   */
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
