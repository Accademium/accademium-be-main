import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../services/authentication.service';
import { AuthResultCognito } from '../dtos/auth-login-cognito.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private readonly authService: AuthenticationService
    ) {
        super({ usernameField: 'email', });
    }

    async validate(email: string, password: string): Promise<AuthResultCognito> {
        return this.authService.verifyUser({ email, password });
    }
}