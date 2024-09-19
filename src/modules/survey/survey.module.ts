import { Module } from '@nestjs/common';
import { SurveyService } from './services/survey.service';
import { SurveyController } from './controllers/survey.controller';
import { AIClient } from './ai/ai.client';
import { DynamooseModule } from 'nestjs-dynamoose';
import { SurveyResultSchema } from './schemas/survey-result.schema';

@Module({
  imports : [DynamooseModule.forFeature([
    {
      name: 'SurveyAnswers',
      schema: SurveyResultSchema,
      options: {
        tableName: 'survey_answers',
        create: false,
        update: false,
        waitForActive: false,
      },
    },
  ]),
],
  controllers: [
    SurveyController
  ],
  providers: [
    SurveyService, 
    AIClient
  ],
})
export class SurveyModule {}
