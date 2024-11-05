import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CitySchema } from './schemas/city.schema';
import { CityController } from './controllers/city.controller';
import { CityService } from './services/city.service';
import { CityRepository } from './repositories/city.repository';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

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
      },
    ]),
  ],
  controllers: [CityController],
  providers: [
    CityService, 
    CityRepository, 
    ErrorHandlingService
  ],
  exports: [CityService],
})
export class CityModule {}
