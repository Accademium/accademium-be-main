import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { City, CityKey } from '../interfaces/city.interface';

@Injectable()
export class CityRepository {
  constructor(
    @InjectModel('City')
    private readonly cityModel: Model<City, CityKey>,
  ) {}

  async create(city: City): Promise<City> {
    return await this.cityModel.create(city);
  }

  async findByName(name: string): Promise<City> {
    const result = await this.cityModel.scan('name').eq(name).exec();
    return result[0];
  }
}
