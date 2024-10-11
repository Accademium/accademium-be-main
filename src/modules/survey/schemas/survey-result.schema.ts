import { Schema } from 'dynamoose';

export const SurveyResultSchema = new Schema(
  {
    surveyId: {
      type: String,
      hashKey: true,
      required: true,
    },
    userId: {
      type: String,
      index: {
        name: 'userIdIndex',
        type: 'global',
      },
      required: true,
    },
    answers: {
      type: Object,
    },
    fieldRecommendations: {
      type: Array,
      schema: [String],
    },
    selectedField: String,
    programRecommendations: {
      type: Array,
      schema: [String],
    },
    selectedProgram: String,
    customerAgreement: String,
    questionsVersion: String,
  },
  {
    timestamps: true,
    saveUnknown: true,
  },
);
