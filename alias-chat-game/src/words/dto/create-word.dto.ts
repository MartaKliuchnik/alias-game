import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

/**
 * DTO for creating a new word.
 */
export class CreateWordDto {
  /**
   * Word string.
   */
  @IsString({ message: 'Word must be a string.' })
  @MinLength(1, { message: 'Word must contain at least one character.' })
  @MaxLength(50, { message: 'Word must not exceed 50 characters.' })
  @Matches(/^\S+$/, { message: 'Word must be a single word without spaces.' }) // Ensures the word is a single word
  readonly word: string;

  /**
   * Array of similar words strings
   */
  @IsArray({ message: 'SimilarWords must be an array.' })
  @IsString({ each: true, message: 'Each similar word must be a string.' })
  @ArrayNotEmpty({ message: 'SimilarWords array must not be empty.' })
  @ArrayUnique({ message: 'Similar words must be unique.' })
  @IsOptional()
  readonly similarWords?: string[] = [];
}
