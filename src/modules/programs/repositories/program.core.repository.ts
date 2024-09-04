import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ProgramCore } from '../interfaces/program-core.interface';
import { ProgramKey } from '../interfaces/program-key.interface';

@Injectable()
export class ProgramCoreRepository {
    constructor(
        @InjectModel('ProgramsCore')
        private programsCoreModel: Model<ProgramCore, ProgramKey>
    ) {}

    async get(key: ProgramKey): Promise<ProgramCore> {
        return await this.programsCoreModel.get(key);
      }

    async create(programCore: ProgramCore): Promise<ProgramCore> {
        return await this.programsCoreModel.create(programCore);
    }

    async update(key: ProgramKey, program: Partial<ProgramCore>): Promise<ProgramCore> {
        return await this.programsCoreModel.update(key, program);
    }

    async findByField(field: string): Promise<ProgramCore[]> {
        console.log(2);
        return await this.programsCoreModel.scan().filter('fields').contains(field).exec();
    }
}