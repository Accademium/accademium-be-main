import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ICity } from '../interfaces/city.interface';
import { CityKey } from 'src/utils/interfaces/keys';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Injectable()
export class CityRepository {
  private readonly SERVICE_NAME = 'CityRepository';
  constructor(
    @InjectModel('CityDetails')
    private cityModel: Model<ICity, CityKey>,
    private readonly errorHandlingService: ErrorHandlingService
  ) {}

  async createAll(cities: ICity[]): Promise<ICity[]> {
    return await Promise.all(cities.map((city) => this.cityModel.create(city)));
  }

  async findByName(name: string): Promise<ICity> {
    try {
      const result = await this.cityModel.scan('name').eq(name).exec();
      return result.length > 0 ? result[0] : null;
    }
    catch (error) {
      this.errorHandlingService.handleDynamoSerachError(error, name, `${this.SERVICE_NAME}.findByName`)
    }
  }

  // async findById(id: CityKey): Promise<ICity> {
  //   try {
  //     const result = await this.cityModel
  //       .query()
  //       .
  //     return result[0];
  //   }
  //   catch (error) {
  //     this.errorHandlingService.handleDynamoSerachError(error, name, `${this.SERVICE_NAME}.findByName`)
  //   }
  // }
}
