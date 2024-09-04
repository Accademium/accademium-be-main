import { ProgramKey } from "./program-key.interface";

export interface ProgramCore extends ProgramKey{
  city: string;
  fields: string[];
  field_tags: string[];
  name: string[];
  title: string;
}