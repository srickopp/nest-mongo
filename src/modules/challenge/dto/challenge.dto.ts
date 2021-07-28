import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChallenge {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class UpdateChallenge {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}

export class AssignChallenge {
  @ApiProperty()
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty()
  @IsNotEmpty()
  studentId: string;
}

export class CompletedChallenge {
  @ApiProperty()
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty()
  @IsNotEmpty()
  solutions: string;
}

export class ReviewChallenge {
  @ApiProperty()
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty()
  @IsNotEmpty()
  grade: string;

  @ApiProperty()
  @IsNotEmpty()
  comment: string;
}
