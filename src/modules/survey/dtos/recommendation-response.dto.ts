import { IsString, IsArray } from 'class-validator';
import { SurveyKey } from 'src/utils/interfaces/keys';

export class Recommendation {
  @IsString()
  study_field: string;

  @IsString()
  reason: string;
}

export class RecommendationResponseDto {
  @IsString()
  surveyId: string;

  @IsString()
  userId: string;

  @IsArray()
  recommendations: Recommendation[];

  constructor(data: any, surveyId: SurveyKey) {
    this.surveyId = surveyId.surveyId;
    this.recommendations = data.recommendations;
  }
}
