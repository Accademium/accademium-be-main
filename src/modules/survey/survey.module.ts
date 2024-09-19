import { Module } from '@nestjs/common';
import { SurveyService } from './services/survey.service';
import { SurveyController } from './controllers/survey.controller';
import { AIClient } from './ai/ai.client';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService, AIClient],
})
export class SurveyModule {}
