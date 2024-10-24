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

  async create(data: CreateUserDto): Promise<User> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { user_id: id },
    });
  }

  async findByCognitoId(cognitoId: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { cognito_id: cognitoId },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.repository.update(id, {
      last_login: new Date(),
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.update(id, {
      is_active: false,
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return await this.repository.find({
      where: { is_active: true },
    });
  }
}