import { Injectable, Logger } from '@nestjs/common';
import { AIClient } from '../ai/ai.client';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommedationResponseDto } from '../dtos/recommendation-response.dto';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { SurveyResultRepository } from '../repositories/survey-result.repository';
import { CustomerAgreement } from 'src/utils/enums/survey.enums';
import { v4 as uuidv4 } from 'uuid';
import { ProgramCoreService } from 'src/modules/programs/services/program.core.service';
import { PartialSurveyResultOmit, SelectedSurveyFields } from '../interfaces/survey-result.interface';
import { SurveyKey } from 'src/utils/interfaces/keys';
import { SurveyUtils } from '../utils/survey.utils';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Injectable()
export class SurveyService 
{
  private readonly SERVICE_NAME = 'SurveyService';
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    private readonly aiClient: AIClient,
    private readonly surveyResultRepository: SurveyResultRepository,
    private readonly programCoreService: ProgramCoreService,
    private readonly surveyUtils: SurveyUtils,
    private readonly errorhandlingService: ErrorHandlingService
  ) {}

  async processSurvey(
    surveyRequest: RecommendationRequestDto,
    userId: string
  ): Promise<RecommedationResponseDto> {
    try
    {
      const answers = surveyRequest.answers;

      const fieldRecommendations = await this.fetchAIFieldRecommendations(answers);

      this.saveInitialSurveyAnswers(fieldRecommendations, userId, answers);

      return new RecommedationResponseDto(fieldRecommendations);
    }
    catch (error)
    {
      this.errorhandlingService.handleUnexpectedError(this.SERVICE_NAME, "processSurvey", error)
    }
  }

  async getUniversityProgramRecommendations(
    surveyId: SurveyKey,
    userId: string,
    field: string
  ): Promise<UniversityProgramResponseDto> {
    try
    {
      const programRecommendations = await this.fetchAIProgramRecommendations(surveyId, userId, field);

      this.updateSurvey(field, surveyId, programRecommendations);

      return new UniversityProgramResponseDto(programRecommendations);
    }
    catch (error)
    {
      this.errorhandlingService.handleUnexpectedError(this.SERVICE_NAME, "getUniversityProgramRecommendations", error)
    }
  }

  private saveInitialSurveyAnswers(
    fieldRecommendations: string[], 
    userId: string, 
    answers: Record<number, string>
  ):void {
    const surveyResult = this.createPartialSurveyResultOmit(userId, answers, fieldRecommendations);
    this.surveyResultRepository.create(surveyResult);
  }

  private updateSurvey(
    field: string, 
    surveyId: SurveyKey, 
    programRecommendations: string[]
  ): void {
    const updatedResult = this.createSelectedSurveyField(field, programRecommendations);
    this.surveyResultRepository.update(surveyId, updatedResult);  
  }

  private async fetchAIProgramRecommendations(
    surveyId: SurveyKey,
    userId: string, 
    field: string
  ): Promise<string[]> {
    const formatedAnswers = await this.fetchAndFormatSuerveyAnswers(surveyId, userId);
    const programNamesSet = await this.fetchAndFormatProgramsForField(field);
    return await this.aiClient.getUniversityProgramRecommendations(formatedAnswers, Array.from(programNamesSet));  
  }

  private async fetchAIFieldRecommendations(
    answers: Record<number, string>
  ): Promise<string[]> {
    const surveyAnswers = this.surveyUtils.formatSurveyAnswers(answers);
    return await this.aiClient.getRecommendations(surveyAnswers);
  }

  private async fetchAndFormatSuerveyAnswers(
    surveyId: SurveyKey, 
    userId: string
  ): Promise<string> {
    const surveyResults = await this.surveyResultRepository.findBySurveyIdAndUserId(surveyId, userId);
    return this.surveyUtils.formatSurveyAnswers(surveyResults[0].answers);
  }

  private async fetchAndFormatProgramsForField(
    field: string
  ): Promise<Set<string>> {
    const programs = await this.programCoreService.getProgramsByField(field);
    return new Set(programs.flatMap((program) => program.name));
  }

  private createPartialSurveyResultOmit(
    userId: string, 
    answers: Record<number, string>, 
    fieldRecommendations: string[]
  ): PartialSurveyResultOmit {
    return {
      surveyId: uuidv4(),
      userId,
      answers: answers,
      fieldRecommendations,
      customerAgreement: CustomerAgreement.NOT_TRACKED,
      questionsVersion: "1.0",
    };
  }

  private createSelectedSurveyField(
    selectedField: string, 
    programRecommendations: string[]
  ): SelectedSurveyFields {
    return {
      selectedField: selectedField,
      programRecommendations: programRecommendations,
    };
  }
}