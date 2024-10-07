import {
  IsString,
  IsNotEmpty,
  Length,
  IsStrongPassword,
} from 'class-validator';

/**
 * DTO for creating a new user.
 */
export class CreateUserDto {
  /**
   * User's name.
   */
  @IsString()
  @Length(3, 20)
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  /**
   * User's password.
   */
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  readonly password: string;
}
