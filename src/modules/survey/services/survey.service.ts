import { Injectable, Logger } from '@nestjs/common';
import { AIClient } from '../ai/ai.client';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { RecommendationResponseDto } from '../dtos/recommendation-response.dto';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { SurveyResultRepository } from '../repositories/survey-result.repository';
import { CustomerAgreement } from 'src/utils/enums/survey.enums';
import { v4 as uuidv4 } from 'uuid';
import { ProgramCoreService } from 'src/modules/programs/services/program-metadata.service';
import {
  PartialSurveyResultOmit,
  SelectedSurveyFields,
} from '../interfaces/survey-result.interface';
import { SurveyKey } from 'src/utils/interfaces/keys';
import { SurveyUtils } from '../utils/survey.utils';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Injectable()
export class SurveyService {
  private readonly SERVICE_NAME = 'SurveyService';
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    private readonly aiClient: AIClient,
    private readonly surveyResultRepository: SurveyResultRepository,
    private readonly programCoreService: ProgramCoreService,
    private readonly surveyUtils: SurveyUtils,
    private readonly errorhandlingService: ErrorHandlingService,
  ) {}

  async processSurveyFieldRecommendations(
    surveyRequest: RecommendationRequestDto,
    userId: string,
  ): Promise<RecommendationResponseDto> {
    try {
      const answers = surveyRequest.answers;

      const recommendationsResponseDTO =
        await this.fetchAIFieldRecommendations(answers);

      const studyFields: string[] = this.extractStudyFieldsFromRecommendations(
        recommendationsResponseDTO,
      );

      const surveyId = await this.saveInitialSurveyAnswers(
        studyFields,
        userId,
        answers,
      );

      recommendationsResponseDTO.surveyId = surveyId;
      return recommendationsResponseDTO;
    } catch (error) {
      this.errorhandlingService.handleUnexpectedError(
        this.SERVICE_NAME,
        'processSurveyFieldRecommendations',
        error,
      );
    }
  }

  async processSurveyProgramRecommendations(
    surveyId: SurveyKey,
    userId: string,
    field: string,
  ): Promise<UniversityProgramResponseDto> {
    try {
      const programRecommendationsDto =
        await this.fetchAIProgramRecommendations(surveyId, userId, field);

      const programs: string[] = this.extractProgramsFromRecommendations(
        programRecommendationsDto,
      );

      this.updateSurvey(field, surveyId, programs);

      return programRecommendationsDto;
    } catch (error) {
      this.errorhandlingService.handleUnexpectedError(
        this.SERVICE_NAME,
        'processSurveyProgramRecommendations',
        error,
      );
    }
  }

  private async fetchAIProgramRecommendations(
    surveyId: SurveyKey,
    userId: string,
    field: string,
  ): Promise<UniversityProgramResponseDto> {
    const formatedAnswers = await this.formatSurveyAnswers(surveyId, userId);
    const programNamesSet = await this.fetchAndFormatProgramsForField(field);
    const response = await this.aiClient.getUniversityProgramRecommendations(
      formatedAnswers,
      Array.from(programNamesSet),
    );

    return new UniversityProgramResponseDto(response, surveyId);
  }

  private async saveInitialSurveyAnswers(
    fieldRecommendations: string[],
    userId: string,
    answers: Record<number, string>,
  ): Promise<SurveyKey> {
    const surveyResult = this.createPartialSurveyResultOmit(
      userId,
      answers,
      fieldRecommendations,
    );
    const createdSurveyResult =
      await this.surveyResultRepository.create(surveyResult);

    return { surveyId: createdSurveyResult.surveyId };
  }

  private updateSurvey(
    field: string,
    surveyId: SurveyKey,
    programRecommendations: string[],
  ): void {
    console.log('field: ' + field);
    console.log('surveyId: ' + surveyId);
    console.log(
      'programRecommendations: ' + JSON.stringify(programRecommendations),
    );
    const updatedResult = this.createSelectedSurveyField(
      field,
      programRecommendations,
    );
    console.log('updatedResult: ' + JSON.stringify(updatedResult));

    this.surveyResultRepository.update(surveyId, updatedResult);
  }

  private async fetchAIFieldRecommendations(
    answers: Record<number, string>,
  ): Promise<RecommendationResponseDto> {
    const surveyAnswers = this.surveyUtils.formatSurveyAnswers(answers);
    const recommendationsObject =
      await this.aiClient.getRecommendations(surveyAnswers);
    return new RecommendationResponseDto(recommendationsObject, null);
  }

  private async formatSurveyAnswers(
    surveyId: SurveyKey,
    userId: string,
  ): Promise<string> {
    const surveyResults =
      await this.surveyResultRepository.findBySurveyIdAndUserId(
        surveyId,
        userId,
      );
    return this.surveyUtils.formatSurveyAnswers(surveyResults[0].answers);
  }

  private async fetchAndFormatProgramsForField(
    field: string,
  ): Promise<Set<string>> {
    const programs = await this.programCoreService.getProgramsByField(
      field,
      'Bachelor',
    );
    return new Set(programs.flatMap((program) => program.title));
  }

  private createPartialSurveyResultOmit(
    userId: string,
    answers: Record<number, string>,
    fieldRecommendations: string[],
  ): PartialSurveyResultOmit {
    return {
      surveyId: uuidv4(),
      userId,
      answers: answers,
      fieldRecommendations,
      customerAgreement: CustomerAgreement.NOT_TRACKED,
      questionsVersion: '1.0',
    };
  }

  private createSelectedSurveyField(
    selectedField: string,
    programRecommendations: string[],
  ): SelectedSurveyFields {
    return {
      selectedField: selectedField,
      programRecommendations: programRecommendations,
    };
  }

  private extractStudyFieldsFromRecommendations(
    recommendationsDTO: RecommendationResponseDto,
  ): string[] {
    return recommendationsDTO.recommendations.map(
      (recommendation) => recommendation.study_field,
    );
  }

  private extractProgramsFromRecommendations(
    recommendationsDTO: UniversityProgramResponseDto,
  ): string[] {
    return recommendationsDTO.program_recommendations.map(
      (recommendation) => recommendation.study_program,
    );
  }
}
