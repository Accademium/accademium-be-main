import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ProgramDetails } from '../interfaces/program-details.interface';
import { ProgramKey } from '../interfaces/program-key.interface';

@Injectable()
export class ProgramDetailsRepository {
    constructor(
        @InjectModel('ProgramDetails')
        private programDetailsModel: Model<ProgramDetails, ProgramKey>
    ) {}

    async get(key: ProgramKey): Promise<ProgramDetails> {
        return await this.programDetailsModel.get(key);
    }

    async create(programDetails: ProgramDetails): Promise<ProgramDetails> {
        return await this.programDetailsModel.create(programDetails);
    }

    async update(key: ProgramKey, program: Partial<ProgramDetails>): Promise<ProgramDetails> {
        return await this.programDetailsModel.update(key, program);
    }
}