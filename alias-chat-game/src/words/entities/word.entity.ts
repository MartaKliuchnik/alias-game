import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Word extends Document {}

export const WordSchema = SchemaFactory.createForClass(Word);
