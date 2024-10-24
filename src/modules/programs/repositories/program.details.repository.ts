import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ProgramDetails } from '../interfaces/program-details.interface';

@Injectable()
export class ProgramDetailsRepository {
  constructor(
    @InjectModel('ProgramDetails')
    private programDetailsModel: Model<ProgramDetails, string>,
  ) {}

  async get(key: string): Promise<ProgramDetails> {
    console.log('Details: ' + key);
    return await this.programDetailsModel.get(key);
  }

  async create(programDetails: ProgramDetails): Promise<ProgramDetails> {
    return await this.programDetailsModel.create(programDetails);
  }

  async update(
    key: string,
    program: Partial<ProgramDetails>,
  ): Promise<ProgramDetails> {
    return await this.programDetailsModel.update(key, program);
  }

  async findByStudyType(study_type: string): Promise<ProgramDetails[]> {
    return await this.programDetailsModel
      .scan('study_type')
      .eq(study_type)
      .exec();
  }
}
