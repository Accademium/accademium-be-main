import { Schema } from 'dynamoose/dist/Schema';

export const ProgramCoreSchema = new Schema({
  programId: {
    type: String,
    hashKey: true,
  },
  city: String,
  fields: {
    type: Array,
    schema: [String],
  },
  programName: String,
  title: String,
  studyType: {
    type: String,
    index: {
      name: 'StudyTypeIndex',
      type: 'global',
    },
    required: true,
  },
  language: String,
  sector: String,
});
