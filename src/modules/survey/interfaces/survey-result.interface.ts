import { CustomerAgreement } from "src/utils/enums/survey.enums";
import { SurveyKey } from "src/utils/interfaces/keys";

export interface ISurveyResult extends SurveyKey{
    userId: string;
    answers: Record<number, string>;
    recommendations: string[];
    customerAgreement: CustomerAgreement;
    questionsVersion: string;
    createdAt: Date;
    updatedAt: Date;
}