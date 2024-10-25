import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DynamooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        aws: {
          region: configService.get('aws.regionDynamo'),
          accessKeyId: configService.get('aws.accessKeyId'),
          secretAccessKey: configService.get('aws.secretAccessKey'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [DynamooseModule],
})
export class DynamoModule {}
