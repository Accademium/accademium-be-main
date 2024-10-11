import { Body, Controller, Param, Post } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommendationResponseDto } from '../dtos/recommendation-response.dto';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { SurveyKey } from 'src/utils/interfaces/keys';

@Controller('api/v1/survey/')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async processSurvey(
    @Body() surveyRequest: RecommendationRequestDto,
  ): Promise<RecommendationResponseDto> {
    return this.surveyService.processSurveyFieldRecommendations(
      surveyRequest,
      '11111111111',
    );
  }

  @Post(':surveyId/:field')
  async getUniversityProgramRecommendations(
    @Param('surveyId') surveyId: SurveyKey,
    @Param('field') field: string,
    //TODO extract userId from the JWT token
  ): Promise<UniversityProgramResponseDto> {
    return this.surveyService.processSurveyProgramRecommendations(
      surveyId,
      '11111111111',
      field,
    );
  }
}
