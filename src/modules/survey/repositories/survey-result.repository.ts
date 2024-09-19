import { Injectable } from "@nestjs/common";
import { InjectModel, Model } from "nestjs-dynamoose";
import { ISurveyResult } from "../interfaces/survey-result.interface";
import { SurveyKey } from "src/utils/interfaces/keys";

@Injectable()
export class SurveyResultRepository {
    constructor(
        @InjectModel('SurveyAnswers')
        private readonly model: Model<ISurveyResult, SurveyKey>,
    ) {}

    async create(
        surveyResult: ISurveyResult
    ): Promise<ISurveyResult> {
        return await this.model.create(surveyResult);
    }

    async findBySurveyId(
        surveyId: SurveyKey
    ): Promise<ISurveyResult | null> {
        return await this.model.get( surveyId );
    }

    async findByUserId(
        userId: SurveyKey
    ): Promise<ISurveyResult[]> {
        return await this.model.query('userId').eq(userId).exec();
    }

    async update(
        surveyId: SurveyKey, 
        updateData: Partial<ISurveyResult>
    ): Promise<ISurveyResult> {
        return await this.model.update(surveyId, updateData);
    }

    async delete(
        surveyId: SurveyKey
    ): Promise<void> {
        await this.model.delete(surveyId);
    }

    async findByUserIdAndVersion(
        userId: string,
        version: string
    ): Promise<ISurveyResult[]> {
        return await this.model.query('userId').eq(userId).where('questionsVersion').eq(version).exec();
    }
}