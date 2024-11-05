import { Injectable } from '@nestjs/common';
import { CognitoService } from 'src/aws/cognito/cognito-client.service';
import { JwtService } from '@nestjs/jwt';
import { generateRandomPassword } from 'src/utils/passwort/randomPasswordGenerator';
import {
  ChangePasswordRequest,
  CreateB2BUserRequest,
  LoginRequest,
  RegistrationRequest,
  VerifyUserRequest,
} from 'src/modules/user/dto/user.auth.dto';
import { ChangeInitialPasswordRequest } from 'src/modules/user/dto/user.cognito.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { TokenTypes } from 'src/utils/enums/token.enum';
import { AuthResult } from '../dtos/auth-login-accademium.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Registers a new student user in the Cognito user pool and assigns them to the "StudentGroup".
   * @param registerDto {@link RegistrationRequest} - The registration data containing user details.
   */
  async registerUser(registerDto: RegistrationRequest): Promise<void> {
    const cognitoResponse = await this.cognitoService.createStudent(registerDto);

    await this.createAccademiumuser(cognitoResponse.UserSub, registerDto);
    await this.addUserToGroup('StudentGroup', registerDto.email)
  }

  /**
   * Creates a B2B user with a temporary password and assigns them to a specified role group.
   * @param createB2BUser {@link CreateB2BUserRequest} - Data for creating the B2B user, including email, organization ID, and role.
   * @returns The temporary password generated for the user.
   */
  async createB2BUser(createB2BUser: CreateB2BUserRequest): Promise<string> { // TODO: create user in database 
    const tempPassword = generateRandomPassword();
    await this.createB2BUserAndAddToGroup(tempPassword, createB2BUser)
    
    return tempPassword;
  }

  /**
   * Authenticates a user using Cognito and returns a signed JWT token.
   * @param loginDto {@link LoginRequest} - The login credentials, including email and password.
   * @returns A signed JWT token if authentication is successful.
   */
  async loginUser(loginDto: LoginRequest): Promise<AuthResult> {
    const decoded = await this.authenticateWithCognitoAndDecodeToken(loginDto);
    const userId = decoded['sub'];
    this.updateLastUserLogin(userId);
    const authToken = this.createJWTToken(decoded);
    const refreshToken = this.createJWTRefreshToken(userId);
    
    return {userId, authToken, refreshToken, tokenType: 'Bearer'};
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
  
  private async authenticateWithCognitoAndDecodeToken(loginDto: LoginRequest) {
    const response = await this.cognitoService.initiateAuth(loginDto);
    const { IdToken } = response.authenticationResult;
    return this.jwtService.decode(IdToken) as Record<string, any>;
  }

  private async updateLastUserLogin(userId: string) {
    await this.userService.updateLastLogin(userId);
  }

  private createJWTToken(decoded: Record<string, any>): string {
    return this.jwtService.sign(
      {
        username: decoded['cognito:username'],
        email: decoded.email,
        groups: decoded['cognito:groups'],
        organisationId: decoded['custom:organisationId'],
        type: TokenTypes.ACCADEMIUM_ACCESS_TOKEN,
      },
      { expiresIn: '1h' },
    );
  }

  private createJWTRefreshToken(userId: string): string {
    return this.jwtService.sign(
      {
        id: userId,
        type: TokenTypes.ACCADEMIUM_REFRESH_TOKEN
      },
      { expiresIn: '7d' },
    );
  }

  private async createB2BUserAndAddToGroup(tempPassword: string, createB2BUser: CreateB2BUserRequest) {
    await this.cognitoService.adminCreateUser({
      tempPassword: tempPassword,
      email: createB2BUser.email,
      organisationId: createB2BUser.organisationId,
    });
    
    this.addUserToGroup(createB2BUser.userGroup, createB2BUser.email)
  }

  private async createAccademiumuser(cognitoId: string, registerDto: RegistrationRequest) {
    await this.userService.createUser({
      userId: cognitoId,
      email: registerDto.email,
      first_name: registerDto.firstName,
      last_name: registerDto.lastName,
    });  
  }

  private async addUserToGroup(userGroup: string, email: string) {
    await this.cognitoService.adminAddUserToGroup({
      userGroup: userGroup,
      email: email,
    });
  }
}

