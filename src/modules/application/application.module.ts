import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controllers/application.controller';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationDocumentService } from './services/application-document.service';
import { ApplicationDocumentRepository } from './repositories/application-document.repository.ts';
import { ApplicationDocumentController } from './controllers/application-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationDocument } from './entities/application-document.entity';
import { ProgramsModule } from '../programs/programs.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application, 
      ApplicationDocument
    ]),
    ProgramsModule,
    UserModule,
  ],
  controllers: [
    ApplicationController, 
    ApplicationDocumentController
  ],
  providers: [
    ApplicationService,
    ApplicationDocumentService,
    ApplicationRepository,
    ApplicationDocumentRepository
  ],
  exports: [
    ApplicationService, 
    ApplicationDocumentService
  ],
})
export class ApplicationModule {}
