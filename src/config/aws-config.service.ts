import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: process.env.AWS_REGION,
  regionDynamo: process.env.AWS_REGION_DYNAMO,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  clientId: process.env.COGNITO_CLIENT_ID,
  userPoolId: process.env.COGNITO_USER_POOL_ID,
}));