import { Schema } from "dynamoose/dist/Schema";

export const ProgramCoreSchema = new Schema ({
  program_id: {
    type: String,
    hashKey: true,
  },
  city: String,
  fields: {
    type: Array,
    schema: [String],
  },
  field_tags: {
    type: Array,
    schema: [String],
  },
  name: {
    type: [String, Array],
    schema: [String],
  },
  title: String,
});
