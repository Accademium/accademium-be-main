import { Controller, Get, Param } from '@nestjs/common';
import { UniversityDetailsService } from '../services/university-details.service';
import { UniversityDetails } from '../entities/university-details.entity';

@Controller('api/v1/university/')
export class UniversityDetailsController {
  constructor(
    private readonly universityDetailsService: UniversityDetailsService
  ) {}

  @Get(':id')
  async getUniversityDetails(
    @Param('id') id: string,
  ): Promise<UniversityDetails> {
    return await this.universityDetailsService.getUniversityDetails(id);
  }
}
