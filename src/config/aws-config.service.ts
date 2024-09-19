import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsConfigService {
  constructor(private configService: ConfigService) {}

  get region() {
    return this.configService.get<string>('AWS_REGION');
  }

  get regionDynamo() {
    return this.configService.get<string>('AWS_REGION_DYNAMO');
  }

  get accessKeyId() {
    return this.configService.get<string>('AWS_ACCESS_KEY_ID');
  }

  get secretAccessKey() {
    return this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  }

  get clientId() {
    return this.configService.get<string>('COGNITO_CLIENT_ID');
  }

  get userPoolId() {
    return this.configService.get<string>('COGNITO_USER_POOL_ID');
  }
}
