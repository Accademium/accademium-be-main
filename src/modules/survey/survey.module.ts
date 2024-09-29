import { Module } from '@nestjs/common';
import { SurveyService } from './services/survey.service';
import { SurveyController } from './controllers/survey.controller';
import { AIClient } from './ai/ai.client';
import { DynamooseModule } from 'nestjs-dynamoose';
import { SurveyResultSchema } from './schemas/survey-result.schema';
import { SurveyResultRepository } from './repositories/survey-result.repository';

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
],
  controllers: [
    SurveyController
  ],
  providers: [
    SurveyService, 
    AIClient,
    SurveyResultRepository,
  ],
})
export class SurveyModule {}
