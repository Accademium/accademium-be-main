import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CitySchema } from './schemas/city.schema';
import { CityController } from './controllers/city.controller';
import { CityService } from './services/city.service';
import { CityRepository } from './repositories/city.repository';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';
import { ProgramMetadataService } from '../programs/services/program-metadata.service';
import { ProgramMetadataRepository } from '../programs/repositories/program-metadata.repository';
import { ProgramMetadata } from '../programs/entities/program-metadata.entity';
import { ProgramsModule } from '../programs/programs.module';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'CityDetails',
        schema: CitySchema,
        options: {
          tableName: 'city_details',
          create: false,
          update: false,
          waitForActive: false,
        },
      },
    ]),
    ProgramsModule
  ],
  controllers: [CityController],
  providers: [
    CityService, 
    CityRepository, 
    ErrorHandlingService,
  ],
  exports: [CityService],
})
export class CityModule {}
