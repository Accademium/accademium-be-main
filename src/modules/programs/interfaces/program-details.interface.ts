export interface ProgramDetails extends Document {
  program_id: string;
  address: string;
  city: string;
  dates_2025: {
    [key: string]: string;
  };
  description: string;
  duration: string;
  ects: string;
  fees: {
    [key: string]: string;
  };
  field: string;
  institution_link: string;
  institution_logo: string;
  institution_name: string;
  language: string;
  link: string;
  sector: string;
  study_type: string;
  title: string;
}
