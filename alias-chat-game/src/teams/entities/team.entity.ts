import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Team extends Document{}

export const TeamSchema = SchemaFactory.createForClass(Team);
