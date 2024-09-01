import {
    Injectable,
    Inject,
    Logger,
    InternalServerErrorException,
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
// import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AwsConfigService } from '../../config/aws-config.service';
import { LoginRequest, RegistrationRequest } from 'src/modules/user/dto/userAuthRequest';
  
@Injectable()
export class CognitoService {
    private readonly logger = new Logger(CognitoService.name);
    private readonly cognitoClient: CognitoIdentityProviderClient;

    constructor(private readonly config: AwsConfigService) {
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
            console.log(this.config.accessKeyId);
            console.log(this.config.clientId);
            console.log(this.config.region);
            console.log(this.config.secretAccessKey);
            console.log(this.config.userPoolId);
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
            this.logger.error('Error executing command: SignUpCommand', error);
            // TODO throw custom exception and handle 
        }
    }
  
    async adminCreateUser(tempPassword: string, email: string, organisationId: string) {
        this.logger.log(`Creating user with email: ${email}`);
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
            this.logger.error('Error executing command: AdminCreateUserCommand', error);
            // TODO throw custom exception and handle 
        }
    }
  
    async adminAddUserToGroup(userGroup: string, username: string) {
        try {
            return await this.cognitoClient.send(
                new AdminAddUserToGroupCommand({
                    UserPoolId: this.config.userPoolId,
                    GroupName: userGroup,
                    Username: username,
                }),
            );
        } catch (error) {
            this.logger.error('Error executing command: AdminAddUserToGroupCommand', error);
            // TODO throw custom exception and handle 
        }
    }
  
    async initiateAuth(loginDto: LoginRequest) {
        try {
            const authResponse = await this.cognitoClient.send(
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
            return authResponse;
        } catch (error) {
            this.logger.error('Error executing command: InitiateAuthCommand', error);
            // TODO throw custom exception and handle 
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
            this.logger.error('Error executing command: ConfirmSignUpCommand', error);
            // TODO throw custom exception and handle 
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
            this.logger.error('Error executing command: AdminGetUserCommand', error);
            // TODO throw custom exception and handle 
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
            this.logger.error('Error executing command: AdminDeleteUserCommand', error);
            // TODO throw custom exception and handle 
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
            this.logger.error('Error executing command: AdminRespondToAuthChallengeCommand', error);
            // TODO throw custom exception and handle 
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
            this.logger.error('Error executing command: ChangePasswordCommand', error);
            // TODO throw custom exception and handle 
        }
    }
}