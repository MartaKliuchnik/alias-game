import {
  IsString,
  IsNotEmpty,
  Length,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  readonly password: string;
}
