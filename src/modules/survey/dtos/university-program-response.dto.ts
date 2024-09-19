import { IsArray, IsString } from 'class-validator';

class ProgramRecommendation {
  @IsString()
  study_program: string;

  @IsString()
  reason: string;
}

export class UniversityProgramResponseDto {
  @IsArray()
  program_recommendations: ProgramRecommendation[];

  constructor(data: any) {
    this.program_recommendations = data.program_recommendations;
  }
}