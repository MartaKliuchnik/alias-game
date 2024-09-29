import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  writeUserIds: string[];

  @IsNotEmpty()
  @IsMongoId()
  readUserId: string;
}
