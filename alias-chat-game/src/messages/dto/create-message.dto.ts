import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  text: string;
}
