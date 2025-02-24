import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Res } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import {
  RegistrationRequest,
  VerifyUserRequest,
  ChangePasswordRequest,
  UserDto,
} from 'src/modules/user/dto/user.auth.dto';
import { ChangeInitialPasswordRequest } from 'src/modules/user/dto/user.cognito.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Response } from 'express';
import { JwtGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh.guard';
import { CurrentUser } from '../decorators/cognito-rsp.decorator';

@Controller('api/v1/auth/')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  /**
   * Test endpoint to check if the service is running.
   * @returns A test string.
   */
  @Post('test')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async test(
  ) {
    return "test";
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
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const user = await this.authService.registerUser(registerDto);
    await this.authService.loginUser(user, response);
  }


  /**
   * Authenticates a user and returns a JWT token.
   * @param req 
   * @returns 
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: UserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.loginUser(user, response);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @CurrentUser() user: UserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.loginUser(user, response);
  }

  /**
   * Verifies a user with a verification code sent to their email.
   * @param verifyDto {@link VerifyUserRequest} - Data containing the email and verification code.
   * @returns A success message upon verification.
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() verifyDto: VerifyUserRequest
  ): Promise<void> {
    await this.authService.verifyCode(verifyDto);
  }

  /**
   * Creates a B2B Admin user with a temporary password.
   * @param registrationDto {@link RegistrationRequest} - Data for registering the B2B Admin.
   * @returns A message with the temporary password for the newly created B2B Admin.
   */
  @Post('create-b2b-admin')
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordRequest,
  ): Promise<string> {
    await this.authService.changePassword(changePasswordRequest);
    return 'Password changed successfully.';
  }

  @Post('pass/change/init')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async changeInitialPassword(
    @Body() changeInitialPasswordRequest: ChangeInitialPasswordRequest,
  ): Promise<string> {
    await this.authService.changeInitialPassword(changeInitialPasswordRequest);
    return 'Password changed successfully.';
  }
}
