import { Controller, Get, Put, Body, Param, Post } from '@nestjs/common';
import { ProgramMetadataService } from '../services/program-metadata.service';
import { CreateProgramMetadataDto, ProgramMetadataDTO, UpdateProgramMetadataDto } from '../dtos/program-metadata.dto';

@Controller('api/v1/program-metadata/')
export class ProgramMetadataController {
  constructor(private readonly programMetadataService: ProgramMetadataService) {}

  @Get(':id')
  async getProgramCore(@Param('id') id: string): Promise<ProgramMetadataDTO> {
    return await this.programMetadataService.getProgramCore(id);
  }

  // TODO: Add @UseGuards(JwtAuthGuard) for authentication
  // TODO: Add @Roles(Role.ADMIN) for authorization
  @Put(':id')
  async updateProgramCore(
    @Param('id') id: string,
    @Body() program: UpdateProgramMetadataDto,
  ): Promise<ProgramMetadataDTO> {
    return await this.programMetadataService.updateProgramCore(id, program);
  }

  @Get(':field/:type') 
  async getProgramsByFieldAnd(
    @Param('field') field: string,
    @Param('type') type: string,
  ): Promise<ProgramMetadataDTO[]> {
    return await this.programMetadataService.getProgramsByField(field, type);
  }

  @Post()
  async createProgramCoreList(
    @Body() programMetadataList: CreateProgramMetadataDto[],
  ): Promise<void> {
    await this.programMetadataService.createProgramCoreList(programMetadataList);
  }
}
