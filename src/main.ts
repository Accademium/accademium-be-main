import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { EnvLoggingMiddleware } from './utils/middleware/env-logging.middleware';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
  app.use(new EnvLoggingMiddleware().use.bind(new EnvLoggingMiddleware()));
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
