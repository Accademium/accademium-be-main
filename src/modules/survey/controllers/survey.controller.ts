import { Body, Controller, Param, Post, UseGuards, Req } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommendationResponseDto } from '../dtos/recommendation-response.dto';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { SurveyKey } from 'src/utils/interfaces/keys';
import { JwtGuard } from 'src/authentication/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/v1/survey/')
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async suggestField(
    @Body() surveyRequest: RecommendationRequestDto,
    @Req() request: Request,
  ): Promise<RecommendationResponseDto> {
    const userId = request.user?.['userId']; 
    return this.surveyService.processSurveyFieldRecommendations(
      surveyRequest,
      userId,
    );
  }

  @Post(':surveyId/:field')
  @UseGuards(JwtGuard)
  async suggestPrograms(
    @Param('surveyId') surveyId: SurveyKey,
    @Param('field') field: string,
    @Req() request: Request,
  ): Promise<UniversityProgramResponseDto> {
    const userId = request.user?.['userId']; 
    return this.surveyService.processSurveyProgramRecommendations(
      surveyId,
      userId,
      field,
    );
  }
}
