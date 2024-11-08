import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class EnvLoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger(EnvLoggingMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        const env = process.env.NODE_ENV
        if (env === 'test' || env === 'dev') {
          const ip = req.headers['x-forwarded-for'] || req.ip;
          this.logger.log(`Request URL: ${req.url}, User IP: ${ip}`);
        }
        next();
    }
}