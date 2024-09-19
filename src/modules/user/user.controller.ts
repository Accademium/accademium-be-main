import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/v1/user/')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
