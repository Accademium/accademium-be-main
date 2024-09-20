import { AIClientEnum } from '../enums/ai-client.enums';
import { BaseException } from './base.exception';

/**
 * Specifically for AI-related errors, with additional AI-specific fields.
 *
 * This Error should be thrown in the Client-Layer using ErrorHandlingService and automatically handled by the filter.
 */
export class AIClientException extends BaseException {
  constructor(
    message: string,
    code: string,
    statusCode: number,
    source: string,
    public readonly aiClientType: AIClientEnum,
  ) {
    super(message, code, statusCode, source);
  }
}
