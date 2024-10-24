import { Injectable, NotFoundException } from '@nestjs/common';
import { ProgramMetadataRepository } from '../repositories/program-metadata.repository';
import { CreateProgramMetadataDto, ProgramMetadataDTO, UpdateProgramMetadataDto } from '../interfaces/program-metadata.dto';

@Injectable()
export class ProgramMetadataService {
  constructor(
    private readonly programRepository: ProgramMetadataRepository,
  ) {}

  async getProgramCore(id: string): Promise<ProgramMetadataDTO> {
    const program = await this.programRepository.findById(id);
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }

  async updateProgramCore(
    id: string,
    updateData: Partial<UpdateProgramMetadataDto>,
  ): Promise<ProgramMetadataDTO> {
    const program = await this.programRepository.findById(id);
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return await this.programRepository.update(id, updateData);
  }

  async getProgramsByField(field: string, type: string): Promise<ProgramMetadataDTO[]> {
    return await this.programRepository.findByFieldAndType(field, type);
  }

  async createProgramCoreList(programMetadataList: CreateProgramMetadataDto[]): Promise<void> {
    await this.programRepository.createMany(programMetadataList);
  }
}