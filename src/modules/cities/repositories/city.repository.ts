import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ICity } from '../interfaces/city.interface';
import { CityKey } from 'src/utils/interfaces/keys';

@Injectable()
export class CityRepository {
  constructor(
    @InjectModel('CityDetails')
    private cityModel: Model<ICity, CityKey>,
  ) {}

  async createAll(
    cities: ICity[]
  ): Promise<ICity[]> {
    return await Promise.all(cities.map(city => this.cityModel.create(city)));
  }

  async findByName(
    name: string
  ): Promise<ICity> {
    const result = await this.cityModel.scan('name').eq(name).exec();
    return result[0];
  }
}
