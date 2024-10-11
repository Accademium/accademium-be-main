import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CityRepository } from '../repositories/city.repository';
import { CreateCityDTO } from '../dto/create-city.dto';
import { ICity } from '../interfaces/city.interface';
import { v4 as uuidv4 } from 'uuid';
import { AccademiumException } from 'src/utils/exceptions/accademium.exception';

@Injectable()
export class CityService {
  private readonly SERVICE_NAME = 'CityService';
  private readonly logger = new Logger(CityService.name);

  constructor(private readonly cityRepository: CityRepository) {}

  async createCityList(createCityDTO: CreateCityDTO[]): Promise<ICity[]> {
    const cityList: ICity[] = createCityDTO.map((dto) => ({
      city_id: uuidv4(),
      ...dto,
    }));
    return await this.cityRepository.createAll(cityList);
  }

  async findByName(name: string): Promise<ICity> {
    const city = await this.cityRepository.findByName(name);
    if (city == null) {
      this.logger.debug(
        `City with name ${name} was not found the the database.`,
      );
      throw new AccademiumException(
        `Failed to fetch city with name ${name} in the database!`,
        'ITEM_NOT_FOUND',
        HttpStatus.BAD_REQUEST,
        this.SERVICE_NAME,
      );
    }
    return city;
  }
}
