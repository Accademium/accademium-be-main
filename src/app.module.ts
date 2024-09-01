import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProgramModule } from './modules/program/program.module';
import { UniversityModule } from './modules/university/university.module';
import { SurveyModule } from './modules/survey/survey.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ApplicationModule } from './modules/application/application.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule, 
    ProgramModule, 
    UniversityModule, 
    SurveyModule, 
    AuthenticationModule,
    ApplicationModule,
    ],
})
export class AppModule {}
