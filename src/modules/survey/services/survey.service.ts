import { HttpCode, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AIClient } from '../ai/ai.client';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommedationResponseDto } from '../dtos/recommendation-response.dto';
import { studyFields, questionAnswers, universityPrograms } from '../data/survey-questions.data';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { AccademiumException } from 'src/utils/exceptions/accademium.exception';
import { AIClientException } from 'src/utils/exceptions/ai-client.exception';
import { error } from 'console';

@Injectable()
export class SurveyService 
{
  private readonly SERVICE_NAME = 'SurveyService';
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    private readonly aiClient: AIClient
  ) {}

  async processSurvey(
    surveyRequest: RecommendationRequestDto
  ): Promise<RecommedationResponseDto> {
    try
    {
      const surveyAnswers = this.formatSurveyAnswers(surveyRequest.answers);
      const aiResponse = await this.aiClient.getRecommendations(surveyAnswers, studyFields);
      return new RecommedationResponseDto(aiResponse);
    }
    catch (error)
    {
      this.logger.error(`Error occured during the execution of ${this.SERVICE_NAME}.processSurvey`);
      throw error;
    }
  }

  async getUniversityProgramRecommendations(
    surveyRequest: RecommendationRequestDto
  ): Promise<UniversityProgramResponseDto> {
    try
    {
      const surveyAnswers = this.formatSurveyAnswers(surveyRequest.answers);
      const aiResponse = await this.aiClient.getUniversityProgramRecommendations(surveyAnswers, universityPrograms);
      return new UniversityProgramResponseDto(aiResponse);
    }
    catch (error)
    {
      this.logger.error(`Error occured during the execution of ${this.SERVICE_NAME}.getUniversityProgramRecommendations`);
      throw error;
    }
  }

  private formatSurveyAnswers(answers: Record<number, number>): string 
  {
    const questions = Object.keys(questionAnswers); 
    return questions
      .map((question, index) => 
        {
        const questionOptions = questionAnswers[question]; 
        const answerIndex = answers[index + 1];
        if (answerIndex !== undefined && questionOptions[answerIndex] !== undefined) 
        {
          return `${index + 1}. ${question}\nAnswer: ${questionOptions[answerIndex]}`;
        } 
        else 
        {
          this.logger.error(`Error occured during the formating of the survey data.`);
          throw new AccademiumException(
            "Failed to format the survey answers!",
            "ANSWERS_FORMAT_FAILURE",
            HttpStatus.BAD_REQUEST,
            this.SERVICE_NAME,
          );
        }
      }).join('\n\n');
  }
}