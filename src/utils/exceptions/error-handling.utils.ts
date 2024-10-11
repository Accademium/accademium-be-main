import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { BaseException } from './base.exception';
import { AccademiumException } from './accademium.exception';

@Injectable()
export class ErrorHandlingUtils {
  private readonly logger = new Logger(ErrorHandlingUtils.name);

  handleUnexpectedError(
    serviceName: string,
    methodName: string,
    error: any,
  ): void {
    this.logger.error(
      `Error occurred in ${serviceName}.${methodName}: ${error.message || error}`,
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
}
