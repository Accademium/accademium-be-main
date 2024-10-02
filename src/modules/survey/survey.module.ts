import { Module } from '@nestjs/common';
import { SurveyService } from './services/survey.service';
import { SurveyController } from './controllers/survey.controller';
import { AIClient } from './ai/ai.client';
import { DynamooseModule } from 'nestjs-dynamoose';
import { SurveyResultSchema } from './schemas/survey-result.schema';
import { SurveyResultRepository } from './repositories/survey-result.repository';
import { ProgramsModule } from '../programs/programs.module';
import { SurveyUtils } from './utils/survey.utils';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Module({
  imports : [
    DynamooseModule.forFeature([
    {
      name: 'SurveyAnswers',
      schema: SurveyResultSchema,
      options: {
        tableName: 'survey_answers'
      },
    },
  ]),
  ProgramsModule
],
  controllers: [
    SurveyController
  ],
  providers: [
    SurveyService, 
    AIClient,
    SurveyResultRepository,
    SurveyUtils,
    ErrorHandlingService
  ],
})
export class SurveyModule {}
