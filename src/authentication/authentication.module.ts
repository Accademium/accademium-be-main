import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { CognitoClientModule } from 'src/aws/cognito/cognito-client.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from './strategies/refreshToken-strategy';
import { RefreshTokenService } from './services/refresh-token.service';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/user-refresh-token.entity';

@Module({
  imports: [
    JwtModule,
    PassportModule,
    UserModule,
    CognitoClientModule,
    TypeOrmModule.forFeature([
      RefreshToken
    ]),
  ],
  controllers: [
    AuthenticationController
  ],
  providers: [
    AuthenticationService, 
    LocalStrategy,
    JwtStrategy, 
    JwtRefreshStrategy,
    RefreshTokenService,
    RefreshTokenRepository
  ]
})
export class AuthenticationModule {}
