import { Body, Controller, Post } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommedationResponseDto } from '../dtos/recommendation-response.dto';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';

@Controller('api/v1/survey/')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async processSurvey(@Body() surveyRequest: RecommendationRequestDto): Promise<RecommedationResponseDto> {
    return this.surveyService.processSurvey(surveyRequest);
  }

  @Post('university-programs')
  async getUniversityProgramRecommendations(@Body() surveyRequest: RecommendationRequestDto): Promise<UniversityProgramResponseDto> {
    return this.surveyService.getUniversityProgramRecommendations(surveyRequest);
  }
}
