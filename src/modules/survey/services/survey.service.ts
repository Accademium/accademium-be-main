import { Injectable, Logger } from '@nestjs/common';
import { AIClient } from '../ai/ai.client';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { Recommendation, RecommendationResponseDto } from '../dtos/recommendation-response.dto';
import { UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
import { SurveyResultRepository } from '../repositories/survey-result.repository';
import { CustomerAgreement } from 'src/utils/enums/survey.enums';
import { v4 as uuidv4 } from 'uuid';
import { ProgramMetadataService } from 'src/modules/programs/services/program-metadata.service';
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
    private readonly programMetadataService: ProgramMetadataService,
    private readonly surveyUtils: SurveyUtils,
    private readonly errorhandlingService: ErrorHandlingService,
  ) {}

  async processSurveyFieldRecommendations(
    surveyRequest: RecommendationRequestDto,
    userId: string,
  ): Promise<RecommendationResponseDto> {
    try {
      const answers = surveyRequest.answers;

      const recommendations =
        await this.fetchAIFieldRecommendations(answers);

      const studyFields: string[] = this.extractStudyFieldsFromRecommendations(
        recommendations,
      );

      const surveyId = await this.saveInitialSurveyAnswers(
        studyFields,
        userId,
        answers,
      );

      return {recommendations, surveyId: surveyId.surveyId, userId};
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
    const updatedResult = this.createSelectedSurveyField(
      field,
      programRecommendations,
    );
    console.log('updatedResult: ' + JSON.stringify(updatedResult));

    this.surveyResultRepository.update(surveyId, updatedResult);
  }

  private async fetchAIFieldRecommendations(
    answers: Record<number, string>,
  ): Promise<Recommendation[]> {
    const surveyAnswers = this.surveyUtils.formatSurveyAnswers(answers);
    const airesponse = await this.aiClient.getRecommendations(surveyAnswers);
    return airesponse.recommendations;
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
    const programs = await this.programMetadataService.findProgramsByFieldAndType(
      field,
      'bachelor',
    );
    return new Set(programs.flatMap((program) => program.generalized_name));
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
    recommendations: Recommendation[],
  ): string[] {
    return recommendations.map(
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
