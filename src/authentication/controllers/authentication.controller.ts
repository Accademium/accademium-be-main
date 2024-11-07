import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Res } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import {
  RegistrationRequest,
  VerifyUserRequest,
  ChangePasswordRequest,
} from 'src/modules/user/dto/user.auth.dto';
import { ChangeInitialPasswordRequest } from 'src/modules/user/dto/user.cognito.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { Response } from 'express';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CognitoResponse } from '../decorators/cognito-rsp.decorator';
import { AuthResultCognito } from '../dtos/auth-login-cognito.dto';

@Controller('api/v1/auth/')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  /**
   * Test endpoint to check if the service is running.
   * @returns A test string.
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  async test(): Promise<string> {
    return 'Test.';
  }

  /**
   * Registers a new student user.
   * @param registerDto {@link RegistrationRequest} - The registration data for the student.
   * @returns A success message upon successful registration.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerStudent(
    @Body() registerDto: RegistrationRequest,
  ): Promise<string> {
    await this.authService.registerUser(registerDto);
    // TODO fix return string
    return 'Student registered successfully. Please check your email for verification.';
  }


  /**
   * Authenticates a user and returns a JWT token.
   * @param req 
   * @returns 
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @CognitoResponse() cognitoResponse: AuthResultCognito,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.loginUser(cognitoResponse, response);
  }

  /**
   * Verifies a user with a verification code sent to their email.
   * @param verifyDto {@link VerifyUserRequest} - Data containing the email and verification code.
   * @returns A success message upon verification.
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body() verifyDto: VerifyUserRequest
  ): Promise<string> {
    await this.authService.verifyCode(verifyDto);
    return 'User verified successfully. You can login now with your credentials.';
  }

  /**
   * Creates a B2B Admin user with a temporary password.
   * @param registrationDto {@link RegistrationRequest} - Data for registering the B2B Admin.
   * @returns A message with the temporary password for the newly created B2B Admin.
   */
  @Post('create-b2b-admin')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('PlatformAdminGroup')
  @HttpCode(HttpStatus.CREATED)
  async createB2BAdmin(
    @Body() registrationDto: RegistrationRequest,
  ): Promise<string> {
    console.log(registrationDto);
    const tempPassword = await this.authService.createB2BUser({
      ...registrationDto,
      userGroup: 'B2BAdminGroup',
    });
    return `B2B Admin created successfully with temporary password: ${tempPassword}`;
  }

  /**
   * Creates a B2B Moderator user with a temporary password.
   * @param registrationDto {@link RegistrationRequest} - Data for registering the B2B Moderator.
   * @returns A message with the temporary password for the newly created B2B Moderator.
   */
  @Post('create-b2b-moderator')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('B2BAdminGroup')
  @HttpCode(HttpStatus.CREATED)
  async createB2BModerator(
    @Body() registrationDto: RegistrationRequest,
  ): Promise<string> {
    console.log(registrationDto);
    const tempPassword = await this.authService.createB2BUser({
      ...registrationDto,
      userGroup: 'B2BModeratorGroup',
    });
    return `B2B Moderator created successfully with temporary password: ${tempPassword}`;
  }

  /**
   * Changes the password of a user.
   * @param changePasswordRequest - Data object which contains the user identifier, current and new password.
   * @returns A success message upon changing the password.
   */
  @Post('pass/change')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordRequest,
  ): Promise<string> {
    await this.authService.changePassword(changePasswordRequest);
    return 'Password changed successfully.';
  }

  @Post('pass/change/init')
  @HttpCode(HttpStatus.OK)
  async changeInitialPassword(
    @Body() changeInitialPasswordRequest: ChangeInitialPasswordRequest,
  ): Promise<string> {
    await this.authService.changeInitialPassword(changeInitialPasswordRequest);
    return 'Password changed successfully.';
  }
}
