import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  username: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
