import { IsArray, IsString } from 'class-validator';
import { SurveyKey } from 'src/utils/interfaces/keys';

export class ProgramRecommendation {
  @IsString()
  study_program: string;

  @IsString()
  reason: string;
}

export class UniversityProgramResponseDto {
  @IsString()
  surveyId: SurveyKey;

  @IsArray()
  programRecommendations: ProgramRecommendation[];

  constructor(data: any, surveyId: SurveyKey) {
    this.surveyId = surveyId;
    this.programRecommendations = data.programRecommendations;
  }
}
