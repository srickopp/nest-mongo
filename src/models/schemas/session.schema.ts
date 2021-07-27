import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({ required: true })
  token: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
