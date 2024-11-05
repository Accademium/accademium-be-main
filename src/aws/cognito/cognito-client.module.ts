import { Module } from '@nestjs/common';
import { CognitoService } from './cognito-client.service';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Module({
  providers: [
    CognitoService, 
    ErrorHandlingService
  ],
  exports: [CognitoService],
})
export class CognitoClientModule {}
