import { BaseException } from './base.exception';

/**
 * Specifically for AWS-related errors, with additional AWS-specific fields.
 *
 * This Error should be thrown in the Service-Layer using ErrorHandlingService and automatically handled by the filter.
 */
export class AwsException extends BaseException {
  constructor(
    message: string,
    code: string,
    statusCode: number,
    source: string,
    public readonly awsErrorCode: string,
    public readonly requestId?: string,
    public readonly serviceSpecificDetails?: Record<string, any>,
  ) {
    super(message, code, statusCode, source);
  }
}
