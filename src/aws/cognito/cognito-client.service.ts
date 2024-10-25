import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  AdminGetUserCommand,
  AdminDeleteUserCommand,
  AdminRespondToAuthChallengeCommand,
  ChangePasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
// import { AwsConfigService } from '../../config/aws-config.service';
import {
  ChangePasswordRequest,
  LoginRequest,
  RegistrationRequest,
} from 'src/modules/user/dto/user.auth.dto';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';
import { CognitoErrorMessage } from '../enums/aws-error-message.enum';
import { AwsException } from 'src/utils/exceptions/aws.exception';
import { VerifyUserRequest } from 'src/modules/user/dto/user.auth.dto';
import {
  ChangeInitialPasswordRequest,
  AdminCreateUserRequest,
  AdminAddUserToGroupRequest,
} from 'src/modules/user/dto/user.cognito.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CognitoService {
  private readonly SERVICE_NAME = 'CognitoService';
  private readonly logger = new Logger(CognitoService.name);
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(
    private readonly config: ConfigService,
    private readonly errorHandlingService: ErrorHandlingService,
  ) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.config.get('aws.region'),
      credentials: {
        accessKeyId: this.config.get('aws.accessKeyId'),
        secretAccessKey: this.config.get('aws.secretAccessKey'),
      },
    });
  }

  /**
   * Registers a new student user in Cognito with the provided registration details.
   * @param registerDto  {@link RegistrationRequest} - An object containing the registration data, including email, password, and organization ID.
   * @throws {AwsException} If the signup process fails.
   */
  async createStudent(registerDto: RegistrationRequest) {
    try {
      return await this.cognitoClient.send(
        new SignUpCommand({
          ClientId: this.config.get('aws.clientId'),
          Username: registerDto.email,
          Password: registerDto.password,
          UserAttributes: [
            { Name: 'email', Value: registerDto.email },
            {
              Name: 'custom:organisationId',
              Value: registerDto.organisationId,
            },
          ],
        }),
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to create student with email = ${registerDto.email}`,
        CognitoErrorMessage.COGNITO_CONFIRM_SIGNUP_FAILED,
      );
    }
  }

  /**
   * Creates a new B2B user in Cognito with a temporary password.
   * @param adminCreateUserRequest {@link AdminCreateUserRequest} - Data object containing tempPassword, email, and organisationId.
   * @throws {AwsException} If the user creation fails.
   */
  async adminCreateUser(adminCreateUserRequest: AdminCreateUserRequest) {
    this.logger.log(
      `Creating B2B user with email: ${adminCreateUserRequest.email}`,
    );
    try {
      return await this.cognitoClient.send(
        new AdminCreateUserCommand({
          UserPoolId: this.config.get('aws.userPoolId'),
          Username: adminCreateUserRequest.email,
          UserAttributes: [
            { Name: 'email', Value: adminCreateUserRequest.email },
            {
              Name: 'custom:organisationId',
              Value: adminCreateUserRequest.organisationId,
            },
          ],
          TemporaryPassword: adminCreateUserRequest.tempPassword,
        }),
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to create B2B-user with email = ${adminCreateUserRequest.email}`,
        CognitoErrorMessage.COGNITO_CREATE_USER_FAILED,
      );
    }
  }

  /**
   * Adds a user to a specified Cognito group.
   * @param adminAddUserToGroupRequest {@link AdminAddUserToGroupRequest} - Data object containing userGroup and email.
   * @throws {AwsException} If adding the user to the group fails.
   */
  async adminAddUserToGroup(
    adminAddUserToGroupRequest: AdminAddUserToGroupRequest,
  ) {
    try {
      return await this.cognitoClient.send(
        new AdminAddUserToGroupCommand({
          UserPoolId: this.config.get('aws.userPoolId'),
          GroupName: adminAddUserToGroupRequest.userGroup,
          Username: adminAddUserToGroupRequest.email,
        }),
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to add ${adminAddUserToGroupRequest.email} to a group`,
        CognitoErrorMessage.COGNITO_ADD_USER_TO_GROUP_FAILED,
      );
    }
  }

  /**
   * Initiates an authentication request for a user with provided credentials.
   * @param loginDto  {@link LoginRequest} - Contains user credentials such as email and password.
   * @returns The authentication response, including tokens or challenges.
   * @throws {AwsException} If the authentication fails.
   * @throws {AccademiumException} If the challenge is unsupported.
   */
  async initiateAuth(loginDto: LoginRequest) {
    let authResponse: any;
    try {
      authResponse = await this.cognitoClient.send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: this.config.get('aws.clientId'),
          AuthParameters: {
            USERNAME: loginDto.email,
            PASSWORD: loginDto.password,
          },
        }),
      );
      this.logger.log(
        `Authentication response: ${JSON.stringify(authResponse)}`,
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to authenticate user ${loginDto.email}`,
        CognitoErrorMessage.COGNITO_INITIATE_AUTH_FAILED,
      );
    }
    if (!authResponse.AuthenticationResult) {
      const challengeName = authResponse.ChallengeName;
      if (challengeName !== 'NEW_PASSWORD_REQUIRED') {
        throw this.errorHandlingService.createAccademiumException(
          `Authentication failed. Challenge not supported. ${challengeName}`,
          CognitoErrorMessage.COGNITO_INITIATE_AUTH_FAILED,
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.SERVICE_NAME,
        );
      }
      return authResponse;
    }
  }

  /**
   * Confirms the sign-up of a user using the provided confirmation code.
   * @param verifyDto {@link VerifyUserRequest} - Data object which contains the email of the user whose sign-up needs to be confirmed and the confirmation code sent to the user.
   * @throws {AwsException} If confirmation of the sign-up fails.
   */
  async confirmSignUp(verifyDto: VerifyUserRequest) {
    try {
      return await this.cognitoClient.send(
        new ConfirmSignUpCommand({
          ClientId: this.config.get('aws.clientId'),
          Username: verifyDto.email,
          ConfirmationCode: verifyDto.code,
        }),
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to validate signup code for user ${verifyDto.email}`,
        CognitoErrorMessage.COGNITO_CONFIRM_SIGNUP_FAILED,
      );
    }
  }

  /**
   * Retrieves information about a specific user from Cognito.
   * @param email {@link string} - The email of the user to retrieve.
   * @throws {AwsException} If retrieving the user information fails.
   */
  async adminGetUser(email: string) {
    try {
      return await this.cognitoClient.send(
        new AdminGetUserCommand({
          UserPoolId: this.config.get('aws.userPoolId'),
          Username: email,
        }),
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to information for user ${email}`,
        CognitoErrorMessage.COGNITO_GET_USER_DATA_FAILED,
      );
    }
  }

  /**
   * Deletes a user from the Cognito User Pool.
   * @param email {@link string} - The email of the user to be deleted.
   * @throws {AwsException} If the user deletion fails.
   */
  async adminDeleteUser(email: string) {
    try {
      return await this.cognitoClient.send(
        new AdminDeleteUserCommand({
          UserPoolId: this.config.get('aws.userPoolId'),
          Username: email,
        }),
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to delete user ${email}`,
        CognitoErrorMessage.COGNITO_DELETE_USER_FAILED,
      );
    }
  }

  /**
   * Completes the new password challenge for a user when required during the authentication flow.
   * @param changeInitialPasswordRequest {@link ChangeInitialPasswordRequest} - Data object, which contains the user's email address, session authentication response and the new password to be set.
   * @throws {AwsException} If completing the new password challenge fails.
   */
  async respondToNewPasswordChallenge(
    changeInitialPasswordRequest: ChangeInitialPasswordRequest,
  ) {
    try {
      return await this.cognitoClient.send(
        new AdminRespondToAuthChallengeCommand({
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ClientId: this.config.get('aws.clientId'),
          UserPoolId: this.config.get('aws.userPoolId'),
          Session: changeInitialPasswordRequest.session,
          ChallengeResponses: {
            USERNAME: changeInitialPasswordRequest.email,
            NEW_PASSWORD: changeInitialPasswordRequest.newPassword,
          },
        }),
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to complete new password challenge for user ${changeInitialPasswordRequest.email}`,
        CognitoErrorMessage.COGNITO_NEW_PASSWORD_CHALLENGE_FAILED,
      );
    }
  }

  /**
   * Changes the password of a user in Cognito using their access token.
   * @param changePasswordRequest {@link ChangePasswordRequest} - Data object containing the access token of the authenticated user,
   * the current password and the new password to be set.
   * @throws {AwsException} If changing the password fails.
   */
  async changePassword(changePasswordRequest: ChangePasswordRequest) {
    try {
      return await this.cognitoClient.send(
        new ChangePasswordCommand({
          AccessToken: changePasswordRequest.cognitoAccessToken,
          PreviousPassword: changePasswordRequest.currentPassword,
          ProposedPassword: changePasswordRequest.newPassword,
        }),
      );
    } catch (error) {
      this.handleCognitoError(
        error,
        `Failed to change password`,
        CognitoErrorMessage.COGNITO_CHANGE_PASSWORD_FAILED,
      );
    }
  }

  /**
   * Handles errors occurring during Cognito operations and logs them.
   * @param error - The exception thrown during Cognito operations.
   * @param message - The custom error message to be logged.
   * @param code - The specific error code corresponding to the operation that failed.
   * @throws {AwsException} Re-throws the error with a custom message and code.
   */
  private handleCognitoError(
    error: AwsException,
    message: string,
    code: string,
  ) {
    this.logger.error(message);
    throw this.errorHandlingService.createAwsException(
      error,
      message,
      code,
      HttpStatus.INTERNAL_SERVER_ERROR,
      this.SERVICE_NAME,
    );
  }
}
