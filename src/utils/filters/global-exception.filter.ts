import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { BaseException } from '../exceptions/base.exception';
import { AwsException } from '../exceptions/aws.exception';
import { AIClientException } from '../exceptions/ai-client.exception';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.debug('Exception caught! Request path:' + request?.url);
    this.logger.debug('exception: ' + JSON.stringify(exception));
    this.logger.log('request.cookies: ', request.cookies)

    if (exception instanceof BaseException) {
      const errorResponse: any = {
        statusCode: exception.statusCode,
        message: exception.message,
        code: exception.code,
        source: exception.source,
      };

      if (exception instanceof AwsException) {
        errorResponse.awsErrorCode = exception.awsErrorCode;
        errorResponse.requestId = exception.requestId;
        // ONLY serviceSpecificDetails in NON-production environments
        if (process.env.NODE_ENV !== 'prod') {
          errorResponse.serviceSpecificDetails =
            exception.serviceSpecificDetails;
        }
      }

      if (exception instanceof AIClientException) {
        errorResponse.aiModel = exception.aiClientType;
      }

      response.status(exception.statusCode).json(errorResponse);
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      this.logger.error('Unexpected error', exception);
      if (response && response.status) {
        response.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
        });
      } else {
        super.catch.call(this, exception, host);
      }
    }
  }
}
