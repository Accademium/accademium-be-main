import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CreateCityDTO } from '../dto/create-city.dto';
import { City } from '../interfaces/city.interface';

@Controller('cities')
export class CityController {
    constructor(
        private readonly cityService: CityService
    ) {}

    @Post()
    async createCity(
        @Body() createCityDTO: CreateCityDTO
    ): Promise<City> {
        return await this.cityService.createCity(createCityDTO);
    }

    @Get(':name')
    async findByName(
        @Param('name') name: string
    ): Promise<City> {
        return await this.cityService.findByName(name);
    }
}