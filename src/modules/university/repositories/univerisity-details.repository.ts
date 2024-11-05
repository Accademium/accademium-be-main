import { Injectable } from '@nestjs/common';
import { UniversityDetails } from '../entities/university-details.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UniversityDetailsRepository {
    constructor(
        @InjectRepository(UniversityDetails)
        private readonly universityDetailsRepository: Repository<UniversityDetails>,
      ) {}

    /**
     * 
     * @param id 
     * @returns 
     */
    async getUniversityDetails(
        id: string,
    ): Promise<UniversityDetails> {
        return await this.universityDetailsRepository.findOne({ where: { university_id: id } });
    }
}
