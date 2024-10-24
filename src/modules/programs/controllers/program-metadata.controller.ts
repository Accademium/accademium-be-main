import { Controller, Get, Put, Body, Param, Post } from '@nestjs/common';
import { ProgramMetadataService } from '../services/program-metadata.service';
import { CreateProgramMetadataDto, ProgramMetadataDTO, UpdateProgramMetadataDto } from '../interfaces/program-metadata.dto';

@Controller('api/v1/program-core/')
export class ProgramCoreController {
  constructor(private readonly programCoreService: ProgramMetadataService) {}

  @Get(':id')
  async getProgramCore(@Param('id') id: string): Promise<ProgramMetadataDTO> {
    return await this.programCoreService.getProgramCore(id);
  }

  // TODO: Add @UseGuards(JwtAuthGuard) for authentication
  // TODO: Add @Roles(Role.ADMIN) for authorization
  @Put(':id')
  async updateProgramCore(
    @Param('id') id: string,
    @Body() program: Partial<UpdateProgramMetadataDto>,
  ): Promise<ProgramMetadataDTO> {
    return await this.programCoreService.updateProgramCore(id, program);
  }

  @Get(':field/:type') 
  async getBachelorProgramsByField(
    @Param('field') field: string,
    @Param('type') type: string,
  ): Promise<ProgramMetadataDTO[]> {
    return await this.programCoreService.getProgramsByField(field, type);
  }

  @Post()
  async createProgramCoreList(
    @Body() programMetadataList: CreateProgramMetadataDto[],
  ): Promise<void> {
    await this.programCoreService.createProgramCoreList(programMetadataList);
  }
}
