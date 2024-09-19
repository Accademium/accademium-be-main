import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CitySchema } from './schemas/city.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'CityDetails',
        schema: CitySchema,
        options: {
          tableName: 'city_details',
          create: false,
          update: false,
          waitForActive: false,
        },
      }
    ]),
  ],
  controllers: [],
  providers: [
  ],
  exports: [],
})
export class CitiesModule {}
