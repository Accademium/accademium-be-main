// src/auth/auth.service.ts
import { Injectable, BadRequestException, InternalServerErrorException, HttpCode, HttpStatus } from '@nestjs/common';
import { CognitoService } from '../aws/cognito/cognito-client.service';
import { JwtService } from '@nestjs/jwt';
import { generateRandomPassword } from '../utils/passport/randomPasswordGenerator';
import { CreateB2BUserRequest, LoginRequest, RegistrationRequest, VerifyUserRequest } from 'src/modules/user/dto/userAuthRequest';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegistrationRequest): Promise<void> 
  {
    await this.cognitoService.createStudent(registerDto);
    await this.cognitoService.adminAddUserToGroup('StudentGroup', registerDto.email);
  }

  async createB2BUser(createB2BUser: CreateB2BUserRequest): Promise<string> 
  {
    const tempPassword = generateRandomPassword();
    await this.cognitoService.adminCreateUser(tempPassword, createB2BUser.email, createB2BUser.organisationId);
    await this.cognitoService.adminAddUserToGroup(createB2BUser.role, createB2BUser.email);
    return tempPassword;
  }

  async loginUser(loginDto: LoginRequest): Promise<string | any> 
  {
    const response = await this.cognitoService.initiateAuth(loginDto);

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
  }

  async verifyUser(verifyDto: VerifyUserRequest): Promise<void> 
  {
    await this.cognitoService.confirmSignUp(verifyDto.email, verifyDto.code);
  }

  async changePassword(user: string, currentPassword: string, newPassword: string): Promise<void> 
  {
    await this.cognitoService.changePassword(user, currentPassword, newPassword);
  }

  async changeInitialPassword(email: string, session: string, newPassword: string): Promise<void> 
  {
    await this.cognitoService.respondToNewPasswordChallenge(email, session, newPassword);
  }
}
