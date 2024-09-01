import { Module } from '@nestjs/common';
import { AwsConfigService } from '../../config/aws-config.service';
import { CognitoService } from './cognito-client.service';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Module({
  providers: [
    CognitoService, 
    AwsConfigService,
    ErrorHandlingService
  ],
  exports: [CognitoService],
})
export class CognitoClientModule {}
