import { IsArray, IsString } from 'class-validator';
import { SurveyKey } from 'src/utils/interfaces/keys';

class ProgramRecommendation {
  @IsString()
  study_program: string;

  @IsString()
  reason: string;
}

export class UniversityProgramResponseDto {
  @IsString()
  surveyId: SurveyKey;

  @IsArray()
  program_recommendations: ProgramRecommendation[];

  constructor(data: any, surveyId: SurveyKey) {
    this.surveyId = surveyId;
    this.program_recommendations = data.program_recommendations;
  }
}
