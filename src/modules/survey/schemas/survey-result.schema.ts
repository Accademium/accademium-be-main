import { Schema } from "dynamoose";

export const SurveyResultSchema = new Schema({
    surveyId: {
        type: String,
        hashKey: true,
    },
    userId: {
        type: String,
        index: {
            name: 'userIdIndex',
            type: 'global'
        },
    },
    answers: {
        type: Object,
    },
    recommendations: {
        type: Array,
        schema: [String],
    },
    customerAgreement: String,
    questionsVersion: String,
}, 
{
    timestamps: true,
});
  