import { Controller, Get, Put, Body, Param, Post } from '@nestjs/common';
import { ProgramMetadataService } from '../services/program-metadata.service';
import { CreateProgramMetadataDto, ProgramMetadataDTO, UpdateProgramMetadataDto } from '../dtos/program-metadata.dto';
import { CountryEnum } from 'src/utils/enums/country.enum';

@Controller('api/v1/program-metadata/')
export class ProgramMetadataController {
  constructor(private readonly programMetadataService: ProgramMetadataService) {}

  @Get(':id')
  async getProgramCore(@Param('id') id: string): Promise<ProgramMetadataDTO> {
    return await this.programMetadataService.findProgramMetadata(id);
  }

  // TODO: Add @UseGuards(JwtAuthGuard) for authentication
  // TODO: Add @Roles(Role.ADMIN) for authorization
  @Put(':id')
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
  async createProgramCoreList(
    @Body() programMetadataList: CreateProgramMetadataDto[],
  ): Promise<void> {
    await this.programMetadataService.createProgramMetadataList(programMetadataList);
  }
}
