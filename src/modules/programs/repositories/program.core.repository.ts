import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ProgramCore } from '../interfaces/program-core.interface';
import { ProgramKey } from '../interfaces/program-key.interface';

@Injectable()
export class ProgramCoreRepository {
  constructor(
    @InjectModel('ProgramsCore')
    private programsCoreModel: Model<ProgramCore, ProgramKey>,
  ) {}

  async get(key: ProgramKey): Promise<ProgramCore> {
    console.log("Core: " + key)
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

  // async findByField(field: string): Promise<ProgramCore[]> {
  //     try {
  //         console.log('Scan result:' + field);
  //         return this.programsCoreModel.scan().exec();
  //         // .scan('fields').contains(field).exec();
  //     } catch (error) {
  //         console.error('Error in findByField:', error);
  //         throw error;
  //     }
  // }

  async findByField(
    field: string,
  ): Promise<ProgramCore[]> {//: Promise<Pick<ProgramCore, 'program_id' | 'title' | 'city'>[]> 
    return this.programsCoreModel
      .scan('fields') // Specify the attribute to scan
      .contains(field) // Add condition to check if 'fields' contains the value
      .attributes(['program_id', 'title', 'city']) // Specify which attributes to return
      .exec(); // Execute the scan operation
  }
}
