import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS,
    refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS,
}));