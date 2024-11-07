import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { AccademiumException } from 'src/utils/exceptions/accademium.exception';

@Injectable()
export class SurveyService {
  private readonly SERVICE_NAME = 'SurveyService';
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    private readonly aiClient: AIClient,
    private readonly surveyResultRepository: SurveyResultRepository,
    private readonly programMetadataService: ProgramMetadataService,
    private readonly surveyUtils: SurveyUtils,
  ) {}

  /**
   * 
   * @param surveyRequest 
   * @param userId 
   * @returns 
   * @throws 
   */
  async processSurveyFieldRecommendations(
    surveyRequest: RecommendationRequestDto,
    userId: string,
  ): Promise<RecommendationResponseDto> {
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
  }

  /**
   * 
   * @param surveyId 
   * @param userId 
   * @param field 
   * @returns 
   */
  async processSurveyProgramRecommendations(
    surveyId: SurveyKey,
    userId: string,
    field: string,
  ): Promise<UniversityProgramResponseDto> {
    const programRecommendationsDto =
      await this.fetchAIProgramRecommendations(surveyId, userId, field);

    const programs: string[] = this.extractProgramsFromRecommendations(
      programRecommendationsDto,
    );

    this.updateSurvey(field, surveyId, programs);
    return programRecommendationsDto;
  }

  /**
   * 
   * @param surveyId 
   * @param userId 
   * @param field 
   * @returns 
   */
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

  /**
   * 
   * @param fieldRecommendations 
   * @param userId 
   * @param answers 
   * @returns 
   */
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

  /**
   * 
   * @param field 
   * @param surveyId 
   * @param programRecommendations 
   */
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

  /**
   * TODO
   * @param answers 
   * @returns 
   */
  private async fetchAIFieldRecommendations(
    answers: Record<number, string>,
  ): Promise<Recommendation[]> {
    const surveyAnswers = this.surveyUtils.formatSurveyAnswers(answers);
    const airesponse = await this.aiClient.getRecommendations(surveyAnswers);
    return airesponse.recommendations;
  }

  /**
   * TODO
   * @param surveyId 
   * @param userId 
   * @returns 
   */
  private async formatSurveyAnswers(
    surveyId: SurveyKey,
    userId: string,
  ): Promise<string> {
    const surveyResults = await this.surveyResultRepository.findBySurveyIdAndUserId( surveyId, userId );

    if (surveyResults[0] && surveyResults[0].answers) {
      return this.surveyUtils.formatSurveyAnswers(surveyResults[0].answers);
    } else {
      this.logger.error(`User with id = ${userId} has no survey with id = ${surveyId}.`);
      throw new AccademiumException(
        `User with id = ${userId} has no survey with id = ${surveyId}.`,
        'ITEM_NOT_FOUND',
        HttpStatus.BAD_REQUEST,
        this.SERVICE_NAME,
      );
    }  
  }

  /**
   * TODO
   * @param field 
   * @returns {Set<string>}
   * @throws {AccademiumException}
   */
  private async fetchAndFormatProgramsForField(
    field: string,
  ): Promise<Set<string>> {
    const degreeType = 'bachelor';
    const programs = await this.programMetadataService.findProgramsByFieldAndDegreeType( field, degreeType );
    return new Set(programs.flatMap((program) => program.generalized_name));
  }

  /**
   * TODO
   * @param userId 
   * @param answers 
   * @param fieldRecommendations 
   * @returns 
   */
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

  /**
   * TODO
   * @param selectedField 
   * @param programRecommendations 
   * @returns 
   */
  private createSelectedSurveyField(
    selectedField: string,
    programRecommendations: string[],
  ): SelectedSurveyFields {
    return {
      selectedField: selectedField,
      programRecommendations: programRecommendations,
    };
  }

  /**
   * TODO
   * @param recommendations 
   * @returns 
   */
  private extractStudyFieldsFromRecommendations(
    recommendations: Recommendation[],
  ): string[] {
    return recommendations.map(
      (recommendation) => recommendation.study_field,
    );
  }

  /**
   * TODO
   * @param recommendationsDTO 
   * @returns 
   */
  private extractProgramsFromRecommendations(
    recommendationsDTO: UniversityProgramResponseDto,
  ): string[] {
    return recommendationsDTO.program_recommendations.map(
      (recommendation) => recommendation.study_program,
    );
  }
}
