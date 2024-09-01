import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsConfigService {
  public readonly region = process.env.AWS_REGION;
  public readonly accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  public readonly secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  public readonly clientId = process.env.COGNITO_CLIENT_ID;
  public readonly userPoolId = process.env.COGNITO_USER_POOL_ID;
}