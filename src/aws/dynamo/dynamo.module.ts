import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DynamooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        aws: {
          region: configService.get<string>('AWS_REGION_DYNAMO'),
          accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [DynamooseModule],
})
export class DynamoModule {}