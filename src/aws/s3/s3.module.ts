import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Module({
  providers: [
    S3Service,
    ErrorHandlingService,
  ],
  exports: [S3Service],
})
export class S3Module {}
