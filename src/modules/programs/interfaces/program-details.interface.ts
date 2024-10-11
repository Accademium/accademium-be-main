import { ProgramKey } from "src/utils/interfaces/keys";

export interface ProgramDetails extends ProgramKey {
  address: string;
  city: string;
  dates: {
    START_DATE: string;
    DEADLINE_EU: string;
    DEADLINE_NON_EU: string;
  };
  description: string;
  duration: string;
  ects: string;
  fees: {
    EU: string;
    INSTITUTIONAL: string;
    NON_EU: string;
  };
  field: string;
  institutionLink: string;
  institutionLogo: string;
  institutionName: string;
  language: string;
  link: string;
  sector: string;
  studyType: string;
  title: string;
}