import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CognitoService } from '../../aws/cognito/cognito-client.service';

@Injectable()
export class UserService {
  constructor(private readonly cognitoService: CognitoService) {}

  async getUserProfile(
    email: string,
  ): Promise<{ UserAttributes: any; UserCreateDate: Date }> {
    try {
      const response = await this.cognitoService.adminGetUser(email);
      const { UserAttributes, UserCreateDate } = response;
      return { UserAttributes, UserCreateDate };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve user profile',
        error.message,
      );
    }
  }

  async deleteUserProfile(email: string): Promise<void> {
    try {
      await this.cognitoService.adminDeleteUser(email);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete user profile',
        error.message,
      );
    }
  }
}
