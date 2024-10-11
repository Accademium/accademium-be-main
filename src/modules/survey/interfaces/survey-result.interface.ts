import { CustomerAgreement } from 'src/utils/enums/survey.enums';
import { SurveyKey } from 'src/utils/interfaces/keys';

export interface ISurveyResult extends SurveyKey {
  userId: string;
  answers: Record<number, string>;
  fieldRecommendations: string[];
  selectedField?: string;
  programRecommendations?: string[];
  selectedProgram?: string;
  customerAgreement: CustomerAgreement;
  questionsVersion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PartialSurveyResultOmit = Omit<
  ISurveyResult,
  | 'selectedField'
  | 'programRecommendations'
  | 'selectedProgram'
  | 'createdAt'
  | 'updatedAt'
>;
export type SelectedSurveyFields = Pick<
  ISurveyResult,
  'selectedField' | 'programRecommendations'
>; //'surveyId' |
