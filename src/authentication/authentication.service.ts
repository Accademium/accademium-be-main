import { Injectable } from '@nestjs/common';
import { CognitoService } from '../aws/cognito/cognito-client.service';
import { JwtService } from '@nestjs/jwt';
import { generateRandomPassword } from '../utils/passport/randomPasswordGenerator';
import {
  ChangePasswordRequest,
  CreateB2BUserRequest,
  LoginRequest,
  RegistrationRequest,
  VerifyUserRequest,
} from 'src/modules/user/dto/user.auth.dto';
import { ChangeInitialPasswordRequest } from 'src/modules/user/dto/user.cognito.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new student user in the Cognito user pool and assigns them to the "StudentGroup".
   * @param registerDto {@link RegistrationRequest} - The registration data containing user details.
   */
  async registerUser(registerDto: RegistrationRequest): Promise<void> {
    await this.cognitoService.createStudent(registerDto);
    await this.cognitoService.adminAddUserToGroup({
      userGroup: 'StudentGroup',
      email: registerDto.email,
    });
  }

  /**
   * Creates a B2B user with a temporary password and assigns them to a specified role group.
   * @param createB2BUser {@link CreateB2BUserRequest} - Data for creating the B2B user, including email, organization ID, and role.
   * @returns The temporary password generated for the user.
   */
  async createB2BUser(createB2BUser: CreateB2BUserRequest): Promise<string> {
    const tempPassword = generateRandomPassword();
    await this.cognitoService.adminCreateUser({
      tempPassword: tempPassword,
      email: createB2BUser.email,
      organisationId: createB2BUser.organisationId,
    });
    await this.cognitoService.adminAddUserToGroup({
      userGroup: createB2BUser.userGroup,
      email: createB2BUser.email,
    });
    return tempPassword;
  }

  /**
   * Authenticates a user using Cognito and returns a signed JWT token.
   * @param loginDto {@link LoginRequest} - The login credentials, including email and password.
   * @returns A signed JWT token if authentication is successful.
   */
  async loginUser(loginDto: LoginRequest): Promise<string> {
    const response = await this.cognitoService.initiateAuth(loginDto);

    const { IdToken } = response.AuthenticationResult;
    const decoded = this.jwtService.decode(IdToken) as Record<string, any>;

    // Creating a custom token with user details and an expiration time of 1 hour.
    const token = this.jwtService.sign(
      {
        username: decoded['cognito:username'],
        email: decoded.email,
        groups: decoded['cognito:groups'],
        organisationId: decoded['custom:organisationId'],
      },
      { expiresIn: '1h' },
    );

    return token;
  }

  /**
   * Verifies a user by confirming their sign-up with a verification code.
   * @param verifyDto {@link VerifyUserRequest}- Data containing the email and verification code.
   */
  async verifyUser(verifyDto: VerifyUserRequest): Promise<void> {
    await this.cognitoService.confirmSignUp(verifyDto);
  }

  /**
   * Changes the password for an authenticated user.
   * @param changePasswordRequest {@link ChangePasswordRequest} - Data object containing cognito access token, old and new password.
   */
  async changePassword(
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<void> {
    await this.cognitoService.changePassword(changePasswordRequest);
  }

  /**
   * Changes the initial temporary password for a user after first login.
   * @param changeInitialPasswordRequest {@link ChangeInitialPasswordRequest} - Data object, which contains the user's email address, session authentication response and the new password to be set.
   */
  async changeInitialPassword(
    changeInitialPasswordRequest: ChangeInitialPasswordRequest,
  ): Promise<void> {
    await this.cognitoService.respondToNewPasswordChallenge(
      changeInitialPasswordRequest,
    );
  }
}
