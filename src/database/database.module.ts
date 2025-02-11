import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import { User } from '../modules/user/entities/user.entity';
import { ApplicationDocument } from '../modules/application/entities/application-document.entity';
import { Application } from '../modules/application/entities/application.entity';
import { ProgramMetadata } from '../modules/programs/entities/program-metadata.entity';
import { UniversityDetails } from '../modules/university/entities/university-details.entity';
import { UserDocument } from '../modules/user/entities/user-document.entity';
import { RefreshToken } from 'src/authentication/entities/user-refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        schema: configService.get('database.schema'),
        entities: [
          User,
          UserDocument,
          Application,
          ApplicationDocument,
          ProgramMetadata,
          UniversityDetails,
          RefreshToken,
        ],
        synchronize: false,
        migrations: ['dist/database/migrations/*{.ts,.js}'],
        migrationsTableName: '_migrations',
        migrationsRun: true,
        logging: true,
        ssl: process.env.NODE_ENV === 'production',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
