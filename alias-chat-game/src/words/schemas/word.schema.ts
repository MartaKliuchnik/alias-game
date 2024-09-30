import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WordDocument = HydratedDocument<Word>;

@Schema()
export class Word {
  @Prop({ type: Types.ObjectId, auto: true })
  wordId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  word: string;

  @Prop({ type: [String], default: [] })
  similarWords: string[];
}

export const WordSchema = SchemaFactory.createForClass(Word);
