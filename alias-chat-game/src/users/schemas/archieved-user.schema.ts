import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArchievedUserDocument = HydratedDocument<ArchivedUser>;

@Schema({
  collection: 'archivedUsers',
})
export class ArchivedUser {
  @Prop({ type: Types.ObjectId, auto: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  hashedPassword: string;

  @Prop({ type: String, required: true })
  salt: string;

  @Prop({ type: Number, default: 0 })
  score: number;

  @Prop({ type: Number, default: 0 })
  played: number;

  @Prop({ type: Number, default: 0 })
  wins: number;

  @Prop({ type: Date, default: Date.now })
  deletedAt: Date;
}

export const ArchivedUserSchema = SchemaFactory.createForClass(ArchivedUser);
