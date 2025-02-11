import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { EnvLoggingMiddleware } from './utils/middleware/env-logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  app.use(new EnvLoggingMiddleware().use.bind(new EnvLoggingMiddleware()));
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
