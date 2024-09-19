import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { UniversityModule } from './modules/university/university.module';
import { SurveyModule } from './modules/survey/survey.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ApplicationModule } from './modules/application/application.module';
import { ConfigModule } from '@nestjs/config';
import { DynamoModule } from './aws/dynamo/dynamo.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './utils/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DynamoModule,
    UserModule,
    ProgramsModule,
    UniversityModule,
    SurveyModule,
    AuthenticationModule,
    ApplicationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
