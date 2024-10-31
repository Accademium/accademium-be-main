import { IsObject } from 'class-validator';

export class RecommendationRequestDto {
  @IsObject()
  answers: Record<string, string>;
}
