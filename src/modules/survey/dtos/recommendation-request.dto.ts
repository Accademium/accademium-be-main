import { IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendationRequestDto {
  @IsObject()
  @Type(() => Number) 
  answers: Record<number, number>; 
}