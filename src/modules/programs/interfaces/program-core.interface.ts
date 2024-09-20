import { ProgramKey } from "src/utils/interfaces/keys";

export interface ProgramCore extends ProgramKey {
  city: string;
  fields: string[];
  field_tags: string[];
  name: string[];
  title: string;
}
