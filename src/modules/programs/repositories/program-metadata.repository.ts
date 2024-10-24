import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramMetadata } from '../entities/program-metadata.entity';
import { CreateProgramMetadataDto, UpdateProgramMetadataDto } from '../dtos/program-metadata.dto';

@Injectable()
export class ProgramMetadataRepository {
  constructor(
    @InjectRepository(ProgramMetadata)
    private readonly programRepository: Repository<ProgramMetadata>,
  ) {}

  async findById(id: string): Promise<ProgramMetadata> {
    return await this.programRepository.findOne({ where: { program_id: id } });
  }

  async update(id: string, updateData: Partial<UpdateProgramMetadataDto>): Promise<ProgramMetadata> {
    await this.programRepository.update({ program_id: id }, updateData);
    return await this.findById(id);
  }

  async findByFieldAndType(field: string, type: string): Promise<ProgramMetadata[]> {
    return await this.programRepository
      .createQueryBuilder('program')
      .where(':field = ANY(program.fields)', { field })
      .andWhere('program.degree_type = :type', { type })
      .getMany();
  }

  async createMany(programs: CreateProgramMetadataDto[]): Promise<void> {
    await this.programRepository.save(programs);
  }
}