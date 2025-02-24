import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CreateCityDTO } from '../dto/create-city.dto';
import { ICity } from '../interfaces/city.interface';

@Controller('api/v1/cities/')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  async createCity(
    @Body() createCityDTOlist: CreateCityDTO[],
  ): Promise<ICity[]> {
    console.log(createCityDTOlist)
    return await this.cityService.createCityList(createCityDTOlist);
  }

  // @Get(':name')
  // async findByName(@Param('name') name: string): Promise<ICity> {
  //   return await this.cityService.findByName(name);
  // }

  @Get(':country/:program/')
  async findCitiesByProgram(
    @Param('country') country: string,
    @Param('program') program: string,
  ): Promise<ICity[]> {
    console.log(`Program to search ${program}`)
    return await this.cityService.findCitiesByProgram(program);
  }
}
