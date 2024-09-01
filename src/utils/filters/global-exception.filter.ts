import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { BaseException } from '../exceptions/base.exception';
import { AwsException } from '../exceptions/aws.exception';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

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
                // Only include serviceSpecificDetails in non-production environments
                if (process.env.NODE_ENV !== 'prod') {
                    errorResponse.serviceSpecificDetails = exception.serviceSpecificDetails;
                }
            }

            response.status(exception.statusCode).json(errorResponse);
        } 
        else if (exception instanceof HttpException) 
        {
            response.status(exception.getStatus()).json(exception.getResponse());
        } 
        else 
        {
            super.catch(exception, host);
        }
    }
}