import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommendationResponseDto } from '../dtos/recommendation-response.dto';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { SurveyKey } from 'src/utils/interfaces/keys';
import { JwtGuard } from 'src/authentication/guards/jwt-auth.guard';

@Controller('api/v1/survey/')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post(':userId')
  @UseGuards(JwtGuard)
  async processSurvey(
    @Body() surveyRequest: RecommendationRequestDto,
    @Param('userId') userId: string,
  ): Promise<RecommendationResponseDto> {
    console.log(surveyRequest);
    return this.surveyService.processSurveyFieldRecommendations(
      surveyRequest,
      userId,
    );
  }

  @Post(':userId/:surveyId/:field')
  @UseGuards(JwtGuard)
  async getUniversityProgramRecommendations(
    @Param('surveyId') surveyId: SurveyKey,
    @Param('field') field: string,
    @Param('userId') userId: string,
    //TODO extract userId from the JWT token
  ): Promise<UniversityProgramResponseDto> {

    return this.surveyService.processSurveyProgramRecommendations(
      surveyId,
      userId,
      field,
    );
  }
}
