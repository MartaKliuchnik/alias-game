import { PartialType } from '@nestjs/mapped-types';
import { CreateWordDto } from './create-word.dto';

/**
 * DTO for updating a word record
 */
export class UpdateWordDto extends PartialType(CreateWordDto) {}
