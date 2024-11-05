import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CognitoService } from 'src/aws/cognito/cognito-client.service';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto } from '../dto/user-management.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Retrieves the profile information of a user by their email.
   * @param email - The email address of the user.
   * @returns An object containing user attributes and account creation date from Cognito.
   * @throws InternalServerErrorException if there is an error retrieving the profile.
   */
  async findCognitoUserProfile(
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

  /**
   * Deletes a user's profile by their email.
   * @param email - The email address of the user to delete.
   * @throws InternalServerErrorException if there is an error during deletion.
   */
  async deleteUserProfile(
    email: string
  ): Promise<void> {
    try {
      await this.cognitoService.adminDeleteUser(email);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete user profile',
        error.message,
      );
    }
  }

  /**
   * Creates a new user in the system.
   * @param createUserDto - Data transfer object containing user creation details.
   * @returns The newly created user.
   */
  async createUser(
    createUserDto: CreateUserDto
  ): Promise<User> {
    return await this.userRepository.create(createUserDto);
  }

  /**
   * Finds a user by their unique ID.
   * @param userId - The unique identifier of the user.
   * @returns The user entity if found.
   */
  async findById(
    userId: string
  ): Promise<User> {
    return await this.userRepository.findById(userId);
  }

  /**
   * Finds a user by their email.
   * @param email - The email address of the user.
   * @returns The user entity if found.
   */
  async findByEmail(
    email: string
  ): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  /**
   * Updates the information of a specific user.
   * @param userId - The unique identifier of the user to update.
   * @param updateUserDto - Data transfer object containing user update details.
   * @returns The updated user entity.
   */
  async updateUser(
    userId: string, 
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    return await this.userRepository.update(userId, updateUserDto);
  }

  /**
   * Updates the last login timestamp of a specific user.
   * @param userId - The unique identifier of the user to update.
   */
  async updateLastLogin(
    userId: string
  ): Promise<void> {
    await this.userRepository.updateLastLogin(userId);
  }

  /**
   * Deactivates a user account by setting its status to inactive.
   * @param userId - The unique identifier of the user to deactivate.
   */
  async deactivateUser(
    userId: string
  ): Promise<void> {
    await this.userRepository.softDelete(userId);
  }
}
