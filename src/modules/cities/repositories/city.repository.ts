import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { City } from '../interfaces/city.interface';
import { CityKey } from 'src/utils/interfaces/keys';

@Injectable()
export class CityRepository {
  constructor(
    @InjectModel('CityDetails')
    private cityModel: Model<City, CityKey>,
  ) {}

  async create(
    city: City
  ): Promise<City> {
    return await this.cityModel.create(city);
  }

  async findByName(
    name: string
  ): Promise<City> {
    const result = await this.cityModel.scan('name').eq(name).exec();
    return result[0];
  }
}
