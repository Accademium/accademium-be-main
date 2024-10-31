import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccademiumException } from '../exceptions/accademium.exception';
import { AwsException } from '../exceptions/aws.exception';
import { AIClientException } from '../exceptions/ai-client.exception';
import { BaseException } from '../exceptions/base.exception';
import e from 'express';

@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger(ErrorHandlingService.name);

  /**
   * Logs errors and performs any additional error handling tasks.
   * Use this method when you want to log an error without throwing it.
   *
   * @param error
   * @param context
   */
  logError(error: Error, context: string): void {
    if (error instanceof AwsException) {
      this.logger.error(
        `[AWS:${error.awsErrorCode}] ${error.message} in ${context}`,
        {
          stack: error.stack,
          requestId: error.requestId,
          serviceSpecificDetails: error.serviceSpecificDetails,
        },
      );
    } else if (error instanceof AccademiumException) {
      this.logger.error(`[ACCADEMIUM:${error.code}] ${error.message} in ${context}`);
    } else if (error instanceof AIClientException) {
      this.logger.error(`[${error.aiClientType}:${error.code}] ${error.message} in ${context}`);
    } else {
      this.logger.error(
        `[ACCADEMIUM:UNEXPECTED_ERROR] Unexpected error in ${context}: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Logs errors and performs any additional error handling tasks.
   * Use this method when you want to log an error without throwing it.
   *
   * @param error
   * @param context
   */
  logErrorAndThrow(error: Error, context: string): never {
    this.logError(error, context);
    throw error;
  }

  handleUnexpectedError(
    serviceName: string,
    methodName: string,
    error: any,
  ): void {
    this.logger.error(
      `[ACCADEMIUM:UNEXPECTED_ERROR] Unexpected error occurred in ${serviceName}.${methodName}: ${error.message || error}`,
      error.stack
    );

    if (error instanceof BaseException) {
      throw error;
    } else {
      throw new AccademiumException(
        `An unexpected error occurred in the ${serviceName} while processing the request. For more details, check the log.`,
        'UNEXPECTED_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
        serviceName,
      );
    }
  }

  handleDynamoSerachError(error: any, searchName: string, source: string): never {
    let message: string = "";
    let code: string = "";
    let status: HttpStatus = HttpStatus.BAD_REQUEST;
  
    if (error.name === 'ResourceNotFoundException') {
      message = `Item with search parameter "${searchName}" in ${source} does not exist`;
      code = "ITEM_NOT_FOUND";
      status = HttpStatus.NOT_FOUND;
    } else if (error.name === 'ValidationError') {
      message = `Invalid search parameter "${searchName}" in ${source}`;
      code = "VALIDATION_ERROR";
    } else {
      this.logger.error(
        `Unexpected error during search for "${searchName}" in ${source}`, 
        error.stack
      );
      message = `Unexpected error during search for "${searchName}" in ${source}`;
      code = "UNEXPECTED_ERROR";
    }
  
    this.logErrorAndThrow(this.createAccademiumException(message, code, status, source) , source);
  }

  /**
   * Creates an AppException. Use this for application-specific errors.
   *
   * @param message
   * @param code
   * @param statusCode
   * @param source
   * @returns
   */
  createAccademiumException(
    message: string,
    code: string,
    statusCode: number,
    source?: string,
  ): AccademiumException {
    return new AccademiumException(message, code, statusCode, source);
  }

  /**
   * Creates an AwsException. Use this for AWS service-related errors.
   *
   * @param awsError
   * @param defaultMessage
   * @param defaultCode
   * @param defaultStatusCode
   * @param source
   * @returns
   */
  createAwsException(
    awsError: any,
    defaultMessage: string,
    defaultCode: string,
    defaultStatusCode: number,
    source: string,
  ): AwsException {
    const awsErrorCode = awsError.name || awsError.code || 'UnknownAwsError';
    const message = awsError.message || defaultMessage;
    const statusCode = awsError.$metadata?.httpStatusCode || defaultStatusCode;

    return new AwsException(
      message,
      defaultCode,
      statusCode,
      source,
      awsErrorCode,
      awsError.$metadata?.requestId,
      this.extractAwsServiceDetails(awsError),
    );
  }

  private extractAwsServiceDetails(awsError: any): Record<string, any> {
    const details: Record<string, any> = {};

    if (awsError.name === 'ValidationException') {
      details.validationErrors = awsError.errors;
    } else if (awsError.name === 'ResourceNotFoundException') {
      details.resourceType = awsError.resourceType;
      details.resourceId = awsError.resourceId;
    }

    return details;
  }
}
