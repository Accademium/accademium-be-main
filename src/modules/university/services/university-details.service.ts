import { Injectable } from '@nestjs/common';
import { UniversityDetailsRepository } from '../repositories/univerisity-details.repository';
import { UniversityDetails } from '../entities/university-details.entity';

@Injectable()
export class UniversityDetailsService {
    constructor(
        private readonly repository: UniversityDetailsRepository
    ) {}

    /**
     * 
     * @param id 
     * @returns 
     */
    async getUniversityDetails(
        id: string,
    ): Promise<UniversityDetails> {
        return await this.repository.getUniversityDetails(id);
    }
}
