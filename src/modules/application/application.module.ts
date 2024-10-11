import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controllers/application.controller';
import { ApplicationDocumentController } from './controllers/application-document.controller';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationDocumentService } from './services/application-document.service';
import { ApplicationDocumentRepository } from './repositories/application-document.repository.ts';
import { DynamooseModule } from 'nestjs-dynamoose';
import { applicationSchema } from './schemas/application.schema';
import { applicationDocumentSchema } from './schemas/application-document.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Application',
        schema: applicationSchema,
        options: {
          tableName: 'applications',
        },
      },
      {
        name: 'ApplicationDocument',
        schema: applicationDocumentSchema,
        options: {
          tableName: 'application_documents',
        },
      },
    ]),
  ],
  controllers: [ApplicationController, ApplicationDocumentController],
  providers: [
    ApplicationService,
    ApplicationDocumentService,
    ApplicationRepository,
    ApplicationDocumentRepository,
  ],
  exports: [ApplicationService, ApplicationDocumentService],
})
export class ApplicationModule {}
