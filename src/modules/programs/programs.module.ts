import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ProgramDetailsSchema } from './schemas/program-details.schema';
import { ProgramCoreSchema } from './schemas/program-core.schema';
import { ProgramDetailsController } from './controllers/program.details.controllers';
import { ProgramCoreController } from './controllers/program.core.controller';
import { ProgramDetailsService } from './services/program.details.service';
import { ProgramCoreService } from './services/program.core.service';
import { ProgramDetailsRepository } from './repositories/program.details.repository';
import { ProgramCoreRepository } from './repositories/program.core.repository';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

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
      {
        name: 'ProgramsCore',
        schema: ProgramCoreSchema,
        options: {
          tableName: 'programs_core',
        },
      },
    ]),
  ],
  controllers: [ProgramDetailsController, ProgramCoreController],
  providers: [
    ProgramDetailsService,
    ProgramCoreService,
    ProgramDetailsRepository,
    ProgramCoreRepository,
    ErrorHandlingService,
  ],
  exports: [ProgramDetailsService, ProgramCoreService],
})
export class ProgramsModule {}
