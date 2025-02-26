import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../services/authentication.service';
import { UserDto } from 'src/modules/user/dto/user.auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private readonly authService: AuthenticationService
    ) {
        super({ usernameField: 'email', });
    }

    async validate(email: string, password: string): Promise<UserDto> {
        return await this.authService.verifyUser({ email, password });
    }
}