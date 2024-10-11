import { Controller, Get, Put, Body, Param, Post } from '@nestjs/common';
import { ProgramCoreService } from '../services/program.core.service';
import { ProgramCore } from '../interfaces/program-core.interface';
import { ProgramKey } from 'src/utils/interfaces/keys';

@Controller('api/v1/program-core/')
export class ProgramCoreController {
  constructor(
    private readonly programCoreService: ProgramCoreService
  ) {}

  @Get(':id')
  async getProgramCore(
    @Param('id') key: ProgramKey
  ): Promise<ProgramCore> 
  {
    console.log("Controller core: " + key)
    return await this.programCoreService.getProgramCore(key);
  }

  // TODO: Add @UseGuards(JwtAuthGuard) for authentication
  // TODO: Add @Roles(Role.ADMIN) for authorization
  @Put(':id')
  async updateProgramCore(
    @Param('id') key: ProgramKey,
    @Body() program: Partial<ProgramCore>,
  ): Promise<ProgramCore> {

    return await this.programCoreService.updateProgramCore(key, program);
  }

  @Get('by-field/:field')
  async getProgramsByField(@Param('field') field: string): Promise<ProgramCore[]>{
    return await this.programCoreService.getProgramsByField(field);
  }

  @Post()
  async createProgramCoreList(
    @Body() programCoreList: ProgramCore[]
  ): Promise<void>{
    await this.programCoreService.createProgramCoreList(programCoreList);
  }
}
