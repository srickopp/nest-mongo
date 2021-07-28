import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/enum/role.enum';
import * as mongoose from 'mongoose';
import { Session } from './session.schema';
import { StudentChallenge } from './studentChallenge.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: Role;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }] })
  sessions?: Session[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentChallenge' }],
  })
  studentChallenge?: StudentChallenge[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentChallenge' }],
  })
  reviewChallenge?: StudentChallenge[];
}

export const UserSchema = SchemaFactory.createForClass(User);
