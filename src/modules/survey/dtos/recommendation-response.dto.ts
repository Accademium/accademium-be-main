import { IsString, IsArray } from 'class-validator';

class Recommendation {
  @IsString()
  study_field: string;

  @IsString()
  reason: string;
}

export class RecommedationResponseDto {
  @IsArray()
  recommendations: Recommendation[];

  constructor(data: any) {
    this.recommendations = data.recommendations;
  }
}