import { IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendationRequestDto {
  @IsObject()
  @Type(() => String) 
  answers: Record<number, string>; 
}