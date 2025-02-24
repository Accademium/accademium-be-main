import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { CognitoClientModule } from 'src/aws/cognito/cognito-client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserDocumentService } from './services/user.document.service';
import { UserDocument } from './entities/user-document.entity';
import { UserDocumentRepository } from './repositories/user.document.repository';
import { S3Module } from 'src/aws/s3/s3.module';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Module({
  imports: [
    CognitoClientModule, 
    TypeOrmModule.forFeature([
      UserDocument,
      User,
    ]),
    S3Module
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService, 
    UserRepository,
    UserDocumentService,
    UserDocumentRepository,
    ErrorHandlingService,
  ],
  exports: [
    UserService, 
    UserDocumentService,
  ],
})
export class UserModule {}
