import { Injectable } from '@nestjs/common';
import { ProgramDetails } from '../interfaces/program-details.interface';
import { ProgramKey } from '../interfaces/program-key.interface';
import { ProgramDetailsRepository } from '../repositories/program.details.repository';

@Injectable()
export class ProgramDetailsService {
    constructor(private programDetailsRepository: ProgramDetailsRepository) {}

    async getProgramDetails(key: ProgramKey): Promise<ProgramDetails> {
        console.log(2);
        return await this.programDetailsRepository.get(key);
    }

    async createProgramDetails(programDetails: ProgramDetails): Promise<ProgramDetails> {
        return await this.programDetailsRepository.create(programDetails);
    }

    async updateProgramDetails(key: ProgramKey, program: Partial<ProgramDetails>): Promise<ProgramDetails> {
        return await this.programDetailsRepository.update(key, program);
    }
}