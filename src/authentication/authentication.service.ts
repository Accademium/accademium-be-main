// src/auth/auth.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CognitoService } from '../aws/cognito/cognito-client.service';
import { JwtService } from '@nestjs/jwt';
import { generateRandomPassword } from '../utils/passport/randomPasswordGenerator';
import { CreateB2BUserRequest, LoginRequest, RegistrationRequest, VerifyUserRequest } from 'src/modules/user/dto/userAuthRequest';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegistrationRequest): Promise<void> {
    try {
      await this.cognitoService.createStudent(registerDto);
      await this.cognitoService.adminAddUserToGroup('StudentGroup', registerDto.email);
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user', error.message);
    }
  }

  async createB2BUser(createB2BUser: CreateB2BUserRequest): Promise<string> {
    try {
      const tempPassword = generateRandomPassword();
      await this.cognitoService.adminCreateUser(tempPassword, createB2BUser.email, createB2BUser.organisationId);
      await this.cognitoService.adminAddUserToGroup(createB2BUser.role, createB2BUser.email);
      return tempPassword;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create B2B user', error.message);
    }
  }

  async loginUser(loginDto: LoginRequest): Promise<string | any> {
    try {
      const response = await this.cognitoService.initiateAuth(loginDto);

      if (!response.AuthenticationResult) {
        const challengeName = response.ChallengeName;
        if (challengeName === 'NEW_PASSWORD_REQUIRED') {
          return response;
        } else {
          throw new BadRequestException('Authentication failed. Challenge not supported.');
        }
      }

      const { IdToken } = response.AuthenticationResult;
      const decoded = this.jwtService.decode(IdToken) as Record<string, any>;

      const token = this.jwtService.sign(
        {
          username: decoded['cognito:username'],
          email: decoded.email,
          groups: decoded['cognito:groups'],
          organisationId: decoded['custom:organisationId'],
        },
        { expiresIn: '1h' }
      );

      return token;
    } catch (error) {
      throw new InternalServerErrorException('Login failed', error.message);
    }
  }

  async verifyUser(verifyDto: VerifyUserRequest): Promise<void> {
    try {
      await this.cognitoService.confirmSignUp(verifyDto.email, verifyDto.code);
    } catch (error) {
      throw new InternalServerErrorException('Failed to verify user', error.message);
    }
  }

  async changePassword(user: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.cognitoService.changePassword(user, currentPassword, newPassword);
    } catch (error) {
      throw new InternalServerErrorException('Failed to change password', error.message);
    }
  }

  async changeInitialPassword(email: string, session: string, newPassword: string): Promise<void> {
    try {
      await this.cognitoService.respondToNewPasswordChallenge(email, session, newPassword);
    } catch (error) {
      throw new InternalServerErrorException('Failed to change initial password', error.message);
    }
  }
}
