import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ProgramDetailsSchema } from './schemas/program-details.schema';
import { ProgramDetailsController } from './controllers/program.details.controllers';
import { ProgramCoreController } from './controllers/program-metadata.controller';
import { ProgramDetailsService } from './services/program.details.service';
import { ProgramDetailsRepository } from './repositories/program.details.repository';
import { ProgramMetadataRepository } from './repositories/program-metadata.repository';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramMetadata } from './entities/program-metadata.entity';
import { ProgramMetadataService } from './services/program-metadata.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'ProgramDetails',
        schema: ProgramDetailsSchema,
        options: {
          tableName: 'program_details',
        },
      },
    ]),
    TypeOrmModule.forFeature([ProgramMetadata]),
  ],
  controllers: [ProgramDetailsController, ProgramCoreController],
  providers: [
    ProgramDetailsService,
    ProgramMetadataService,
    ProgramDetailsRepository,
    ProgramMetadataRepository,
    ErrorHandlingService,
  ],
  exports: [ProgramDetailsService, ProgramMetadataService],
})
export class ProgramsModule {}
