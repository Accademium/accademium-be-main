import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegistrationRequest, LoginRequest, VerifyUserRequest, ChangePasswordRequest } from 'src/modules/user/dto/userAuthRequest';

@Controller('api/v1/')
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
    @Body() registerDto: RegistrationRequest
  ): Promise<string> {
    await this.authService.registerUser(registerDto);
    return 'Student registered successfully. Please check your email for verification.';
  }

  /**
   * Authenticates a user and returns a JWT token.
   * @param loginDto {@link LoginRequest} - The login credentials.
   * @returns An object containing the JWT token.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginRequest
  ): Promise<{ token: string }> {
    const token = await this.authService.loginUser(loginDto);
    return { token };
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
    console.log(verifyDto);
    await this.authService.verifyUser(verifyDto);
    return 'User verified successfully.';
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
      role: 'B2BAdminGroup',
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
      role: 'B2BModeratorGroup',
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
    @Body() { email, session, password }: { email: string; session: string; password: string },
  ): Promise<string> {
    await this.authService.changeInitialPassword(email, session, password);
    return 'Password changed successfully.';
  }
}
