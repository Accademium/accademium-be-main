import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ProgramDetailsService } from '../services/program.details.service';
import { ProgramDetails } from '../interfaces/program-details.interface';
import { ProgramKey } from '../interfaces/program-key.interface';

@Controller('program-details')
export class ProgramDetailsController {
  constructor(private readonly programDetailsService: ProgramDetailsService) {}

  // TODO: Replace ProgramDetails with DTO
  @Get(':id')
  async getProgramDetails(
    @Param('id') key: ProgramKey
  ): Promise<ProgramDetails> 
  {
    console.log("Controller Details: " + key)
    return await this.programDetailsService.getProgramDetails(key);
  }

  // TODO: Replace ProgramDetails with DTO
  // TODO: Add @UseGuards(JwtAuthGuard) for authentication
  // TODO: Add @Roles(Role.ADMIN) for authorization
  @Post()
  async createProgramDetails(
    @Body() programDetails: ProgramDetails,
  ): Promise<ProgramDetails> {
    return this.programDetailsService.createProgramDetails(programDetails);
  }

  // TODO: Replace ProgramDetails with DTO
  // TODO: Add @UseGuards(JwtAuthGuard) for authentication
  // TODO: Add @Roles(Role.ADMIN) for authorization
  @Put(':id')
  async updateProgramDetails(
    @Param() key: ProgramKey,
    @Body() program: Partial<ProgramDetails>,
  ): Promise<ProgramDetails> {
    return this.programDetailsService.updateProgramDetails(key, program);
  }

  @Get('study_type/:study_type')
  async getProgramsByStudyType(@Param('study_type') study_type: string) {
    //: Promise<ProgramCore[]>
    return await this.programDetailsService.getProgramsByStudyType(study_type);
  }
}
