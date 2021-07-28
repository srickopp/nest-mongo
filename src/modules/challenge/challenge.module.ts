import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Challenge,
  ChallengeSchema,
} from 'src/models/schemas/challenge.schema';
import {
  StudentChallenge,
  StudentChallengeSchema,
} from 'src/models/schemas/studentChallenge.schema';
import { User, UserSchema } from 'src/models/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Challenge.name, schema: ChallengeSchema },
      { name: StudentChallenge.name, schema: StudentChallengeSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class ChallengeModule {}
