import { Injectable } from '@nestjs/common';
import { CityRepository } from '../repositories/city.repository';
import { CreateCityDTO } from '../dto/create-city.dto';
import { City } from '../interfaces/city.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

  async createCity(createCityDTO: CreateCityDTO): Promise<City> {
    const city: City = {
      id: uuidv4(),
      ...createCityDTO,
    };
    return await this.cityRepository.create(city);
  }

  async findByName(name: string): Promise<City> {
    return await this.cityRepository.findByName(name);
  }
}
