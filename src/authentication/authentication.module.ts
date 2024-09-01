import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken-strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { CognitoClientModule } from 'src/aws/cognito/cognito-client.module';

@Module({
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    RefreshJwtStrategy,],
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '60s' },
    }),
    UserModule,
    CognitoClientModule
  ]
})
export class AuthenticationModule {}
