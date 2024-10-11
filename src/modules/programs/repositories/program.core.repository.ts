import { Injectable } from '@nestjs/common';
import { InjectModel, Model, TransactionSupport } from 'nestjs-dynamoose';
import { ProgramCore } from '../interfaces/program-core.interface';
import { ProgramKey } from 'src/utils/interfaces/keys';

@Injectable()
export class ProgramCoreRepository extends TransactionSupport {
  constructor(
    @InjectModel('ProgramsCore')
    private programsCoreModel: Model<ProgramCore, ProgramKey>,
  ) {
    super();
  }

  async get(key: ProgramKey): Promise<ProgramCore> {
    return await this.programsCoreModel.get(key);
  }

  async create(programCore: ProgramCore): Promise<ProgramCore> {
    return await this.programsCoreModel.create(programCore);
  }

  async update(
    key: ProgramKey,
    program: Partial<ProgramCore>,
  ): Promise<ProgramCore> {
    return await this.programsCoreModel.update(key, program);
  }

  async findByStudyType(studyType: string): Promise<ProgramCore[]> {
    return await this.programsCoreModel
      .query('studyType')
      .using('StudyTypeIndex')
      .eq(studyType)
      .attributes(['title', 'fields'])
      .exec();
  }
}
