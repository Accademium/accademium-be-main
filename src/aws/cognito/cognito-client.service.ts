import {
    Injectable,
    Inject,
    Logger,
    InternalServerErrorException,
    HttpStatus,
  } from '@nestjs/common';
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
import { AwsConfigService } from '../../config/aws-config.service';
import { LoginRequest, RegistrationRequest } from 'src/modules/user/dto/userAuthRequest';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';
import { CognitoErrorMessage } from '../enums/aws-error-message.enum';
import { AwsException } from 'src/utils/exceptions/aws.exception';
  
@Injectable()
export class CognitoService {
    private readonly SERVICE_NAME = 'CognitoService'
    private readonly logger = new Logger(CognitoService.name);
    private readonly cognitoClient: CognitoIdentityProviderClient;

    constructor(
        private readonly config: AwsConfigService,
        private readonly errorHandlingService: ErrorHandlingService
    ) {
      this.cognitoClient = new CognitoIdentityProviderClient({
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        },
      });
    }
  
    async createStudent(registerDto: RegistrationRequest) {
        try {
            return await this.cognitoClient.send(
                new SignUpCommand({
                    ClientId: this.config.clientId,
                    Username: registerDto.email,
                    Password: registerDto.password,
                    UserAttributes: [
                        { Name: 'email', Value: registerDto.email },
                        { Name: 'custom:organisationId', Value: registerDto.organisationId },
                    ],
                }),
            );
        } catch (error) {
            this.handleCognitoError(
                error, 
                `Failed to create student with email = ${registerDto.email}`, 
                CognitoErrorMessage.COGNITO_CONFIRM_SIGNUP_FAILED
            );       
        }
    }
  
    async adminCreateUser(tempPassword: string, email: string, organisationId: string) {
        this.logger.log(`Creating B2B user with email: ${email}`);
        try {
            return await this.cognitoClient.send(
                new AdminCreateUserCommand({
                    UserPoolId: this.config.userPoolId,
                    Username: email,
                    UserAttributes: [
                        { Name: 'email', Value: email },
                        { Name: 'custom:organisationId', Value: organisationId },
                    ],
                    TemporaryPassword: tempPassword,
                }),
            );
        } catch (error) {
            this.handleCognitoError(
                error, 
                `Failed to create B2B-user with email = ${email}`, 
                CognitoErrorMessage.COGNITO_CREATE_USER_FAILED
            );
        }
    }
  
    async adminAddUserToGroup(userGroup: string, email: string) {
        try {
            return await this.cognitoClient.send(
                new AdminAddUserToGroupCommand({
                    UserPoolId: this.config.userPoolId,
                    GroupName: userGroup,
                    Username: email,
                }),
            );
        } catch (error) {
            this.handleCognitoError(
                error, 
                `Failed to add ${email} to a group`, 
                CognitoErrorMessage.COGNITO_ADD_USER_TO_GROUP_FAILED
            );
        }
    }
  
    async initiateAuth(loginDto: LoginRequest) {
        let authResponse: any;
        try {
            authResponse = await this.cognitoClient.send(
                new InitiateAuthCommand({
                    AuthFlow: 'USER_PASSWORD_AUTH',
                    ClientId: this.config.clientId,
                    AuthParameters: {
                        USERNAME: loginDto.email,
                        PASSWORD: loginDto.password,
                    },
                }),
            );
            this.logger.log(`Authentication response: ${JSON.stringify(authResponse)}`);
        } catch (error) {
            this.handleCognitoError(
                error, 
                `Failed to authenticate user ${loginDto.email}`, 
                CognitoErrorMessage.COGNITO_INITIATE_AUTH_FAILED
            );
        }
        if (!authResponse.AuthenticationResult) 
        {
            const challengeName = authResponse.ChallengeName;
            if (challengeName !== 'NEW_PASSWORD_REQUIRED') 
            {
                throw this.errorHandlingService.createAccademiumException(
                    `Authentication failed. Challenge not supported. ${challengeName}`,
                    CognitoErrorMessage.COGNITO_INITIATE_AUTH_FAILED,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    this.SERVICE_NAME
                );
            } 
            return authResponse;
        }
    }
  
    async confirmSignUp(email: string, code: string) {
        try {
            return await this.cognitoClient.send(
                new ConfirmSignUpCommand({
                    ClientId: this.config.clientId,
                    Username: email,
                    ConfirmationCode: code,
                }),
            );
        } catch (error) {
            this.handleCognitoError(
                error, 
                `Failed to validate signup code for user ${email}`, 
                CognitoErrorMessage.COGNITO_CONFIRM_SIGNUP_FAILED
            );
        }
    }
  
    async adminGetUser(email: string) {
        try {
            return await this.cognitoClient.send(
                new AdminGetUserCommand({
                    UserPoolId: this.config.userPoolId,
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
  
    async adminDeleteUser(email: string) {
        try {
            return await this.cognitoClient.send(
                new AdminDeleteUserCommand({
                    UserPoolId: this.config.userPoolId,
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
  
    async respondToNewPasswordChallenge(email: string, session: string, newPassword: string) {
        try {
            return await this.cognitoClient.send(
                new AdminRespondToAuthChallengeCommand({
                    ChallengeName: 'NEW_PASSWORD_REQUIRED',
                    ClientId: this.config.clientId,
                    UserPoolId: this.config.userPoolId,
                    Session: session,
                    ChallengeResponses: {
                        USERNAME: email,
                        NEW_PASSWORD: newPassword,
                    },
                }),
            );
        } catch (error) {
            this.handleCognitoError(
                error, 
                `Failed to complete new password challenge for user ${email}`,
                CognitoErrorMessage.COGNITO_NEW_PASSWORD_CHALLENGE_FAILED,
            );
        }
    }
  
    async changePassword(cognitoAccessToken: string, currentPassword: string, newPassword: string) {
        try {
            return await this.cognitoClient.send(
                new ChangePasswordCommand({
                    AccessToken: cognitoAccessToken,
                    PreviousPassword: currentPassword,
                    ProposedPassword: newPassword,
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

    private handleCognitoError(error: AwsException, message: string, code: string) {
        this.logger.error(message);
        throw this.errorHandlingService.createAwsException(
            error,
            message,
            code,
            HttpStatus.INTERNAL_SERVER_ERROR,
            this.SERVICE_NAME
        );  
    }
}