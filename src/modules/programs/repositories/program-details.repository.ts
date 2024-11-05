import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ProgramDetails } from '../dtos/program-details.dto';

@Injectable()
export class ProgramDetailsRepository {
  constructor(
    @InjectModel('ProgramDetails')
    private programDetailsModel: Model<ProgramDetails, string>,
  ) {}

  async findById(
    id: string
  ): Promise<ProgramDetails> {
    return await this.programDetailsModel.get(id);
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
