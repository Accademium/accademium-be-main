import { Injectable } from '@nestjs/common';
import { AIClient } from '../ai/ai.client';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommedationResponseDto } from '../dtos/recommendation-response.dto';
import { studyFields, questionAnswers, universityPrograms } from '../data/survey-questions.data';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';

@Injectable()
export class SurveyService {
  constructor(private readonly aiClient: AIClient) {}

  async processSurvey(surveyRequest: RecommendationRequestDto): Promise<RecommedationResponseDto> {
    const surveyAnswers = this.formatSurveyAnswers(surveyRequest.answers);
    console.log("surveyAnswers: ", surveyAnswers);
    const aiResponse = await this.aiClient.getRecommendations(surveyAnswers, studyFields);
    return new RecommedationResponseDto(aiResponse);
  }

  async getUniversityProgramRecommendations(surveyRequest: RecommendationRequestDto): Promise<UniversityProgramResponseDto> {
    const surveyAnswers = this.formatSurveyAnswers(surveyRequest.answers);
    console.log("surveyAnswers: ", surveyAnswers);
    const aiResponse = await this.aiClient.getUniversityProgramRecommendations(surveyAnswers, universityPrograms);
    return new UniversityProgramResponseDto(aiResponse);
  }

  private formatSurveyAnswers(answers: Record<number, string>): string {
    const questions = Object.keys(questionAnswers);
    return questions
      .map((question, index) => {
        const answerIndex = questionAnswers[question].indexOf(answers[index + 1]);
        return `${index + 1}. ${question}\nAnswer: ${questionAnswers[question][answerIndex]}`;
      })
      .join('\n\n');
  }
}