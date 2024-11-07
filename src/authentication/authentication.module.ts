import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken-strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { CognitoClientModule } from 'src/aws/cognito/cognito-client.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService, 
    LocalStrategy,
    JwtStrategy, 
    RefreshJwtStrategy
  ],
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '60s' },
    }),
    UserModule,
    CognitoClientModule,
  ],
})
export class AuthenticationModule {}
