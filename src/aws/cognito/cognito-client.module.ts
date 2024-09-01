import { Module } from '@nestjs/common';
import { AwsConfigService } from '../../config/aws-config.service';
import { CognitoService } from './cognito-client.service';

@Module({
  providers: [CognitoService, AwsConfigService],
  exports: [CognitoService],
})
export class CognitoClientModule {}
