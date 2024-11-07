import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramMetadata } from '../entities/program-metadata.entity';
import { CreateProgramMetadataDto, UpdateProgramMetadataDto } from '../dtos/program-metadata.dto';
import { CountryEnum } from 'src/utils/enums/country.enum';

@Injectable()
export class ProgramMetadataRepository {
  constructor(
    @InjectRepository(ProgramMetadata)
    private readonly programRepository: Repository<ProgramMetadata>,
  ) {}

  /**
   * Retrieves program metadata by its unique program ID.
   * @param id - The unique identifier of the program.
   * @returns The program metadata, including the related university.
   */
  async findById(id: string): Promise<ProgramMetadata> {
    return await this.programRepository.findOne({ 
      where: { program_id: id },
      relations: ['university']
    });
  }

  /**
   * Updates program metadata by its program ID.
   * @param id - The unique identifier of the program.
   * @param updateData - Partial data to update the program metadata.
   * @returns The updated program metadata.
   */
  async update(id: string, updateData: Partial<UpdateProgramMetadataDto>): Promise<ProgramMetadata> {
    await this.programRepository.update({ program_id: id }, updateData);
    return await this.findById(id);
  }

  /**
   * Finds programs based on a specific field and degree type.
   * @param field - The field of study to search for.
   * @param type - The degree type to search for.
   * @returns A list of programs matching the field and degree type.
   */
  async findByFieldAndType(
    field: string, 
    type: string
  ): Promise<ProgramMetadata[]> {
    return await this.programRepository
      .createQueryBuilder('program')
      .where(':field = ANY(program.fields)', { field })
      .andWhere('program.degree_type = :type', { type })
      .getMany();
  }

/**
 * Finds programs based on generalized name and country, limited to 6 results.
 * 
 * @param name - The generalized name of the program.
 * @param country - The country of the university offering the program.
 * @returns A list of programs matching the generalized name and country.
 */
async findByGeneralizedNameAndCountry(
  name: string, 
  country: CountryEnum
): Promise<ProgramMetadata[]> {
  return await this.programRepository
    .createQueryBuilder('program')
    .where('program.generalized_name = :name', { name })
    .andWhere('program.country = :country', { country })
    .take(6)
    .getMany();
}

  /**
   * Creates multiple program metadata records in the database.
   * @param programs - Array of program metadata to be created.
   */
  async createMany(programs: CreateProgramMetadataDto[]): Promise<void> {
    await this.programRepository.save(programs);
  }
}
