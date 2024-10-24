import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';

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
        entities: ['dist/**/**/**/*.entity{.ts,.js}'],
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
