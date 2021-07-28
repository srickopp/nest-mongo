import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId })
  _id: string;

  @Prop({ required: true })
  token: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop()
  password: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
