import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import { Request } from 'express';

@Injectable()
export class DevelopmentSurveyGuard implements CanActivate {
  private readonly logger = new Logger(DevelopmentSurveyGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const isTestOrDev = this.isTestOrDev();

    if (isTestOrDev) {
      this.logRequestDetails(request);
      return true;
    }

    return false;
  }

  private logRequestDetails(request: Request) {
    const ip = request.headers['x-forwarded-for'] || request.ip;
    this.logger.log(`Endpoint called: ${request.url} - IP: ${ip}`);
  }

  private isTestOrDev(): boolean {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    return nodeEnv === 'test' || nodeEnv === 'dev';
  }
}