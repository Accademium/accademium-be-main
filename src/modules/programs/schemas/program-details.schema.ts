import { Schema } from "dynamoose/dist/Schema";

export const ProgramDetailsSchema = new Schema({
  programId: {
    type: String,
    hashKey: true,
  },
  address: String,
  city: String,
  dates: {
    type: Object,
    schema: {
      DEADLINE_EU: String,
      DEADLINE_NON_EU: String,
      START_DATE: String
    },
  },
  description: String,
  duration: String,
  ects: String,
  fees: {
    type: Object,
    schema: {
      EU: String,
      INSTITUTIONAL: String,
      NON_EU: String,
    },
  },
  field: String,
  institution_link: String,
  institution_logo: String,
  institution_name: String,
  language: String,
  link: String,
  sector: String,
  study_type: String,
  title: String,
});
