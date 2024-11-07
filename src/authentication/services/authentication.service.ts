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
import { AuthResultCognito } from '../dtos/auth-login-cognito.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
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
 * Handles user login by creating JWT tokens and setting them as cookies.
 * @param authResult The result from the Cognito authentication, containing the IdToken.
 * @param response The HTTP response object used to set cookies.
 * @param redirect Optional flag to indicate if a redirect should occur after login.
 */
  async loginUser(authResult: AuthResultCognito, response: Response, redirect = false): Promise<void> {
    const { IdToken } = authResult.authenticationResult;
    const decoded = this.jwtService.decode(IdToken) as Record<string, any>;
    const userId = decoded['sub'];
  
    this.updateLastUserLogin(userId);
  
    const accessTokenData = this.createJWTToken(decoded);
    const refreshTokenData = this.createJWTRefreshToken(userId);
  
    const expiresAccessToken = accessTokenData.expirationDate;
    const expiresRefreshToken = refreshTokenData.expirationDate;
  
    // Set cookies for Authentication and Refresh tokens
    response.cookie('Authentication', accessTokenData.accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'prod',
      expires: expiresAccessToken,
    });
  
    response.cookie('Refresh', refreshTokenData.accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'prod',
      expires: expiresRefreshToken,
    });
  
    // Optionally redirect after login
    if (redirect) {
      response.redirect(this.configService.getOrThrow('AUTH_UI_REDIRECT'));
    }
  }

  /**
   * 
   * @param email 
   * @param password 
   * @returns 
   */
  async verifyUser(request: LoginRequest): Promise<AuthResultCognito> {
    return await this.cognitoService.initiateAuth(request);
  }

  /**
   * Verifies a user by confirming their sign-up with a verification code.
   * @param verifyDto {@link VerifyUserRequest}- Data containing the email and verification code.
   */
  async verifyCode(verifyDto: VerifyUserRequest): Promise<void> {
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

  private async updateLastUserLogin(userId: string) {
    await this.userService.updateLastLogin(userId);
  }

  /**
   * Creates a JWT access token for the user with an expiration date.
   * @param decoded The decoded user information from the IdToken.
   * @returns An object containing the generated access token and its expiration date.
   */
  private createJWTToken(decoded: Record<string, any>) {
    return this.createToken(
      decoded['sub'],
      this.configService.getOrThrow<string>('jwt.accessTokenExpiration'),
      decoded['cognito:username'],
      decoded.email,
      decoded['cognito:groups'],
      decoded['custom:organisationId'],
      TokenTypes.ACCADEMIUM_ACCESS_TOKEN,
    );
  }

  /**
   * Creates a JWT refresh token for the user with an expiration date.
   * @param userId The ID of the user for whom the refresh token is being created.
   * @returns An object containing the generated refresh token and its expiration date.
   */
  private createJWTRefreshToken(userId: string) {
    return this.createToken(
      userId,
      this.configService.getOrThrow<string>('jwt.refreshTokenExpiration'),
      undefined,
      undefined,
      undefined,
      undefined,
      TokenTypes.ACCADEMIUM_REFRESH_TOKEN,
    );
  }
  
  private createToken(
    userId: string,
    expirationMs: string,
    username?: string,
    email?: string,
    groups?: string[],
    organisationId?: string,
    tokenType?: string,
  ) {
    const expirationDate = new Date();
    expirationDate.setMilliseconds(expirationDate.getTime() + parseInt(expirationMs));
  
    const tokenPayload: Record<string, any> = { userId, type: tokenType };
  
    if (username) tokenPayload['username'] = username;
    if (email) tokenPayload['email'] = email;
    if (groups) tokenPayload['groups'] = groups;
    if (organisationId) tokenPayload['organisationId'] = organisationId;
  
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
      expiresIn: expirationMs,
    });
  
    return { accessToken, expirationDate };
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

