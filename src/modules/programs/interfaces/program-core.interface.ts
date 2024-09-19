import { ProgramCoreKey } from "src/utils/interfaces/keys";

export interface ProgramCore extends ProgramCoreKey {
  city: string;
  fields: string[];
  field_tags: string[];
  name: string[];
  title: string;
}
