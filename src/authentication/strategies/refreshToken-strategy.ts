import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh',) {
//   constructor(
//     configService: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
//       ignoreExpiration: false,
//       secretOrKey: configService.getOrThrow<string>('jwt.secret'),
//     });
//   }

//   async validate(payload: any) {
//     console.log('validate jwt payload');
//     return { user: payload.sub, username: payload.username };
//   }
// }
