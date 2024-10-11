import { ProgramKey } from 'src/utils/interfaces/keys';

export interface ProgramCore extends ProgramKey {
  city: string;
  fields: string[];
  programName: string;
  title: string;
  studyType: string;
  language: string;
  sector: string;
}
