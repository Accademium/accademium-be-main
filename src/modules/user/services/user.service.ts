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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(createUserDto);
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    return await this.userRepository.update(userId, updateUserDto);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.updateLastLogin(userId);
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.userRepository.softDelete(userId);
  }
}
