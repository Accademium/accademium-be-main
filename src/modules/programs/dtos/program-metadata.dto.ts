import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsArray, IsUUID, IsEnum, ArrayMinSize } from 'class-validator';
import { UniversityDetailsDto } from 'src/modules/university/dto/university-details.dto';
import { DegreeType } from 'src/utils/enums/university.enums';

export class CreateProgramMetadataDto {
  @IsString()
  program_title: string;

  @IsString()
  generalized_name: string;

  @IsUUID()
  university_id: string;

  @IsEnum(DegreeType)
  degree_type: string;

  @IsString()
  language: string;

  @IsString()
  city: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  fields: string[];
}

export class UpdateProgramMetadataDto extends PartialType(CreateProgramMetadataDto) {}

export class ProgramMetadataDTO {
  program_id: string;
  program_title: string;
  generalized_name: string;
  university_id: string;
  degree_type: string;
  language: string;
  city: string;
  fields: string[];
  created_at: Date;
  updated_at: Date;
  university: UniversityDetailsDto;
}