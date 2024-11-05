import { Injectable, NotFoundException } from '@nestjs/common';
import { ProgramMetadataRepository } from '../repositories/program-metadata.repository';
import { CreateProgramMetadataDto, ProgramMetadataDTO, UpdateProgramMetadataDto } from '../dtos/program-metadata.dto';

@Injectable()
export class ProgramMetadataService {
  constructor(
    private readonly programRepository: ProgramMetadataRepository,
  ) {}

  /**
   * Retrieves program metadata by its unique ID.
   * @param id - The unique identifier of the program.
   * @returns The program metadata DTO if found.
   * @throws NotFoundException if the program with the specified ID does not exist.
   */
  async findProgramMetadata(id: string): Promise<ProgramMetadataDTO> {
    const program = await this.programRepository.findById(id);
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }

  /**
   * Updates the metadata of a specific program by its ID.
   * @param id - The unique identifier of the program.
   * @param updateData - Partial data for updating the program metadata.
   * @returns The updated program metadata DTO.
   * @throws NotFoundException if the program with the specified ID does not exist.
   */
  async updateProgramMetadata(
    id: string,
    updateData: Partial<UpdateProgramMetadataDto>,
  ): Promise<ProgramMetadataDTO> {
    const program = await this.programRepository.findById(id);
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return await this.programRepository.update(id, updateData);
  }

  /**
   * Retrieves programs based on a specific field of study and degree type.
   * @param field - The field of study to filter programs by.
   * @param type - The degree type to filter programs by.
   * @returns A list of program metadata DTOs matching the specified criteria.
   */
  async findProgramsByFieldAndType(field: string, type: string): Promise<ProgramMetadataDTO[]> {
    return await this.programRepository.findByFieldAndType(field, type);
  }

  /**
   * Creates multiple program metadata records.
   * @param programMetadataList - Array of program metadata DTOs to be created.
   */
  async createProgramMetadataList(programMetadataList: CreateProgramMetadataDto[]): Promise<void> {
    await this.programRepository.createMany(programMetadataList);
  }
}
