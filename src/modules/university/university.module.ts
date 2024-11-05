import { Module } from '@nestjs/common';
import { UniversityDetailsController } from './controllers/university-details.controller';
import { UniversityDetailsService } from './services/university-details.service';
import { UniversityDetailsRepository } from './repositories/univerisity-details.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityDetails } from './entities/university-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UniversityDetails]),
  ],
  controllers: [
    UniversityDetailsController
  ],
  providers: [
    UniversityDetailsService,
    UniversityDetailsRepository,
  ],
  exports: [
    UniversityDetailsService
  ]
})
export class UniversityModule {}
