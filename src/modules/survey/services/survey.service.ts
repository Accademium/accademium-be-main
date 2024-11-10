import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AIClient } from '../ai/ai.client';
import { RecommendationRequestDto } from '../dtos/recommendation-request.dto';
import { Recommendation, RecommendationResponseDto } from '../dtos/recommendation-response.dto';
import { ProgramRecommendation, UniversityProgramResponseDto } from '../dtos/university-program-response.dto';
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
import { ConfigService } from '@nestjs/config';
import { programRecommendations, recommendations } from '../data/test-survey-res.data';

@Injectable()
export class SurveyService {
  private readonly SERVICE_NAME = 'SurveyService';
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    private readonly aiClient: AIClient,
    private readonly surveyResultRepository: SurveyResultRepository,
    private readonly programMetadataService: ProgramMetadataService,
    private readonly surveyUtils: SurveyUtils,
    private readonly configService: ConfigService
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
    userId: string
  ): Promise<RecommendationResponseDto> {
    const answers = surveyRequest.answers;
    const recommendations = await this.getFieldRecommendations(answers);

    const surveyId = await this.saveInitialSurveyAnswers(
      this.extractStudyFieldsFromRecommendations(recommendations),
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
    field: string
  ): Promise<UniversityProgramResponseDto> {
    const programRecommendationsDto = await this.getUniversityProgramResponse(surveyId, userId, field);
    this.updateSurvey(
      field, 
      surveyId, 
      this.extractProgramsFromRecommendations(programRecommendationsDto)
    );

    return programRecommendationsDto;
  }

  /**
   * 
   * @param surveyId 
   * @param userId 
   * @param field 
   * @returns 
   */
  private async getAIProgramRecommendations(
    surveyId: SurveyKey,
    userId: string,
    field: string,
  ): Promise<UniversityProgramResponseDto> {
    const formatedAnswers = await this.formatSurveyAnswers(surveyId, userId);
    const programNamesSet = await this.getAndFormatProgramsForField(field);
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

    this.surveyResultRepository.update(surveyId, updatedResult);
  }

  /**
   * TODO
   * @param answers 
   * @returns 
   */
  private async getAIFieldRecommendations(
    answers: Record<number, string>,
  ): Promise<Recommendation[]> {
    const surveyAnswers = this.surveyUtils.formatSurveyAnswers(answers);
    const airesponse = await this.aiClient.getRecommendations(surveyAnswers);
    return airesponse.recommendations;
  }

  /**
   * 
   */
  private getTestFieldRecommendations(): Recommendation[] {
    this.logger.log("Returning default test recommendations.")
    return recommendations;
  }

  /**
   * 
   */
  private getTestProgramRecommendations(): ProgramRecommendation[] {
    this.logger.log("Returning default test program recommendations.")
    return programRecommendations;
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
  private async getAndFormatProgramsForField(
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
    return recommendationsDTO.programRecommendations.map(
      (recommendation) => recommendation.study_program,
    );
  }

  private async getFieldRecommendations(
    answers: Record<string, string>
  ): Promise<Recommendation[]> {
    let recommendations: Recommendation[] = null;
    
    if (this.isTestOrDev()){
      recommendations = this.getTestFieldRecommendations();
    } else {
      recommendations =
        await this.getAIFieldRecommendations(answers);
    }

    return recommendations;
  }

  async getUniversityProgramResponse(
    surveyId: SurveyKey, 
    userId: string, 
    field: string
  ): Promise<UniversityProgramResponseDto> {
    let programRecommendationsDto: UniversityProgramResponseDto = null;
    if (this.isTestOrDev()){
      const programRecommendations = this.getTestProgramRecommendations();
      programRecommendationsDto = { programRecommendations, surveyId }
    } else {
      programRecommendationsDto =
        await this.getAIProgramRecommendations(surveyId, userId, field);
    } 
    return programRecommendationsDto;
  }

  private isTestOrDev(): boolean {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    return nodeEnv === 'test' || nodeEnv === 'dev';
  }
}
