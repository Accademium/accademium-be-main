import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommendationResponseDto } from '../dtos/recommendation-response.dto';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { SurveyKey } from 'src/utils/interfaces/keys';
import { JwtGuard } from 'src/authentication/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('api/v1/survey/')
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly configService: ConfigService
  ) {}

  @Post(':userId')
  @UseGuards(JwtGuard)
  async processSurvey(
    @Body() surveyRequest: RecommendationRequestDto,
    @Param('userId') userId: string,
  ): Promise<RecommendationResponseDto> {
    if (this.isTestOrDev()) {
      return this.surveyService.processSurveyFieldRecommendations(
        surveyRequest,
        userId,
      );
    } else {
      return null;
    }
  }

  @Post(':userId/:surveyId/:field')
  @UseGuards(JwtGuard)
  async getUniversityProgramRecommendations(
    @Param('surveyId') surveyId: SurveyKey,
    @Param('field') field: string,
    @Param('userId') userId: string,
    //TODO extract userId from the JWT token
  ): Promise<UniversityProgramResponseDto> {
    if (this.isTestOrDev()) {
      return this.surveyService.processSurveyProgramRecommendations(
        surveyId,
        userId,
        field,
      );
    } else {
      return null;
    }
  }

  private isTestOrDev(): boolean {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    return nodeEnv === 'test' || nodeEnv === 'dev';
  }
}
