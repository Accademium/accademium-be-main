import { Controller, Get, Put, Body, Param, Post, UseGuards } from '@nestjs/common';
import { ProgramMetadataService } from '../services/program-metadata.service';
import { CreateProgramMetadataDto, ProgramMetadataDTO, UpdateProgramMetadataDto } from '../dtos/program-metadata.dto';
import { CountryEnum } from 'src/utils/enums/country.enum';
import { JwtGuard } from 'src/authentication/guards/jwt-auth.guard';

@Controller('api/v1/program-metadata/')
export class ProgramMetadataController {
  constructor(private readonly programMetadataService: ProgramMetadataService) {}

  @Get(':id')
  async getProgramCore(@Param('id') id: string): Promise<ProgramMetadataDTO> {
    return await this.programMetadataService.findProgramMetadata(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateProgramCore(
    @Param('id') id: string,
    @Body() program: UpdateProgramMetadataDto,
  ): Promise<ProgramMetadataDTO> {
    return await this.programMetadataService.updateProgramMetadata(id, program);
  }

  @Get(':name/:country') 
  async findSuggestedProgramsByNameAndCountry(
    @Param('name') name: string,
    @Param('country') country: CountryEnum,
  ): Promise<ProgramMetadataDTO[]> {
    return await this.programMetadataService.findSuggestedProgramsByNameAndCountry(name, country);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createProgramCoreList(
    @Body() programMetadataList: CreateProgramMetadataDto[],
  ): Promise<void> {
    await this.programMetadataService.createProgramMetadataList(programMetadataList);
  }
}
