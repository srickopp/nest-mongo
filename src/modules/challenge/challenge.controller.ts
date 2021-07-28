import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ChallengeService from './challenge.service';

@ApiTags('Challenge')
@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}
}
