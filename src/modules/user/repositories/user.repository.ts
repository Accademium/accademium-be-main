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

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { userId: id },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }


  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, data);
    return await this.repository.save(user);
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