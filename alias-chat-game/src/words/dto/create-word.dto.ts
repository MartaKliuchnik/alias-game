import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsOptional,
} from 'class-validator';

export class CreateWordDto {
  @IsString()
  readonly word: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsOptional()
  readonly similarWords?: string[];
}
