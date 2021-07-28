import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/authentication/auth.module';
import * as dotenv from 'dotenv';
import { ChallengeModule } from './modules/challenge/challenge.module';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`,
      {
        authSource: 'admin',
      },
    ),
    AuthModule,
    ChallengeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
