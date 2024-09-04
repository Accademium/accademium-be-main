import { Schema } from 'dynamoose';

export const ProgramDetailsSchema = new Schema({
  program_id: {
    type: String,
    hashKey: true
  },
  address: String,
  city: String,
  dates_2025: {
    type: Object,
    schema: {
      type: String
    }
  },
  description: String,
  duration: String,
  ects: String,
  fees: {
    type: Object,
    schema: {
      type: String
    }
  },
  field: String,
  institution_link: String,
  institution_logo: String,
  institution_name: String,
  language: String,
  link: String,
  sector: String,
  study_type: String,
  title: String
});