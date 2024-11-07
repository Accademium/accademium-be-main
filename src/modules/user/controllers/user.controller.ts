import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/user-management.dto';
import { JwtGuard } from 'src/authentication/guards/jwt-auth.guard';

@Controller('api/v1/user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @UseGuards(JwtGuard)
  async getUserProfile(@Param('userId') userId: string): Promise<User> {
    return this.userService.findById(userId);
  }

  @Put(':userId')
  @UseGuards(JwtGuard)
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(userId, updateUserDto);
  }
}
