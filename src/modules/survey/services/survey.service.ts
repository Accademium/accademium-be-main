import { HttpCode, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AIClient } from '../ai/ai.client';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommedationResponseDto } from '../dtos/recommendation-response.dto';
import { studyFields, questionAnswers, universityPrograms } from '../data/survey-questions.data';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { AccademiumException } from 'src/utils/exceptions/accademium.exception';
import { AIClientException } from 'src/utils/exceptions/ai-client.exception';
import { error } from 'console';
import { SurveyResultRepository } from '../repositories/survey-result.repository';
import { ISurveyResult } from '../interfaces/survey-result.interface';
import { CustomerAgreement } from 'src/utils/enums/survey.enums';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class SurveyService 
{
  private readonly SERVICE_NAME = 'SurveyService';
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    private readonly aiClient: AIClient,
    private readonly surveyResultRepository: SurveyResultRepository
  ) {}

  async processSurvey(
    surveyRequest: RecommendationRequestDto,
    userId: string
  ): Promise<RecommedationResponseDto> {
    try
    {
      const surveyAnswers = this.formatSurveyAnswers(surveyRequest.answers);
      const aiResponse = await this.aiClient.getRecommendations(surveyAnswers, studyFields);

      const surveyResult = this.createSurveyResult(userId, surveyRequest.answers, aiResponse);
      await this.surveyResultRepository.create(surveyResult);

      return new RecommedationResponseDto(aiResponse);
    }
    catch (error)
    {
      this.logger.error(`Error occured during the execution of ${this.SERVICE_NAME}.processSurvey`);
      throw error;
    }
  }

  async getUniversityProgramRecommendations(
    userId: string
  ): Promise<UniversityProgramResponseDto> {
    try
    {
      const surveyResults = await this.surveyResultRepository.findByUserId(userId);
      const surveyAnswers = this.formatSurveyAnswers(surveyResults[0].answers);
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

  private createSurveyResult(
    userId: string, 
    answers: Record<number, number>, 
    recommendations: string[]
  ): ISurveyResult {
    const now = new Date();
    return {
      survey_id: uuidv4(),
      userId,
      answers,
      recommendations,
      customerAgreement: CustomerAgreement.NOT_TRACKED,
      questionsVersion: "1.0",
      createdAt: now,
      updatedAt: now,
    };
  }
}