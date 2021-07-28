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
import ChallengeController from './challenge.controller';
import ChallengeService from './challenge.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Challenge.name, schema: ChallengeSchema },
      { name: StudentChallenge.name, schema: StudentChallengeSchema },
    ]),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
