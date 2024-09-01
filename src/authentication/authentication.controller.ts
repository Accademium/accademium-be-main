import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegistrationRequest, LoginRequest, VerifyUserRequest } from 'src/modules/user/dto/userAuthRequest';
// import { RolesGuard } from '../guards/roles.guard';
// import { Roles } from '../decorators/roles.decorator';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('api/v1/')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  async test(): Promise<string> {
    return 'Test.';
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerStudent(@Body() registerDto: RegistrationRequest): Promise<string> {
    console.log(registerDto);
    await this.authService.registerUser(registerDto);
    return 'Student registered successfully. Please check your email for verification.';
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginRequest
  ): Promise<{ token: string }> {
    console.log(loginDto);
    const token = await this.authService.loginUser(loginDto);
    return { token };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body() verifyDto: VerifyUserRequest
  ): Promise<string> {
    console.log(verifyDto);
    await this.authService.verifyUser(verifyDto);
    return 'User verified successfully.';
  }

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

  @Post('pass/change')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() { user, currentPassword, newPassword }: { user: string; currentPassword: string; newPassword: string },
  ): Promise<string> {
    await this.authService.changePassword(user, currentPassword, newPassword);
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
