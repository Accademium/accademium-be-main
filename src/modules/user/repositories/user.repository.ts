import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/user-management.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * Creates a new user record in the database.
   * @param data - Data for creating a new user, as per CreateUserDto.
   * @returns The newly created user.
   */
  async create(data: CreateUserDto): Promise<User> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The unique identifier of the user.
   * @returns The user entity if found, otherwise undefined.
   */
  async findById(id: string): Promise<User> {
    return await this.repository.findOne({
      where: { userId: id },
    });
  }

  /**
   * Finds a user by their email address.
   * @param email - The email of the user to be found.
   * @returns The user entity if found, otherwise undefined.
   */
  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  /**
   * Updates user information based on their ID.
   * @param id - The unique identifier of the user.
   * @param data - Partial user data to update.
   * @returns The updated user entity.
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, data);
    return await this.repository.save(user);
  }

  /**
   * Updates the last login timestamp for a specific user.
   * @param id - The unique identifier of the user.
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.repository.update(id, {
      lastLogin: new Date(),
    });
  }

  /**
   * Soft deletes a user by setting their 'is_active' status to false.
   * @param id - The unique identifier of the user.
   */
  async softDelete(id: string): Promise<void> {
    await this.repository.update(id, {
      isActive: false,
    });
  }

  /**
   * Retrieves all active users from the database.
   * @returns A list of active users.
   */
  async findActiveUsers(): Promise<User[]> {
    return await this.repository.find({
      where: { isActive: true },
    });
  }
}
