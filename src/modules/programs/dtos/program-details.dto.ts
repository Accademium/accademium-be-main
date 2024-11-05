export interface ProgramDetails {
  programId: string;
  programName: string;
  duration: string;
  ects: number;
  graduationTitle: string;
  fees: {
    eea: number;
    nonEea: number;
    institutional: number;
  };
  deadlines: {
    eea: string;
    nonEea: string;
  };
  startDate: string;
  applicationRequirements: string[];
  languageRequirements: string[];
  description: string;
  studyinnlLink?: string;
  programWebsite: string;
  university: string;
  universityType: string;
  universityLogoLink: string;
  address: string;
  country: string;
  city: string;
  createdAt?: Date;
  updatedAt?: Date;
}