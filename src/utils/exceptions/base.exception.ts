/**
 * A base class for all custom exceptions.
 *
 * This Error should be thrown in the Service-Layer using ErrorHandlingService and automatically handled by the filter.
 */
export class BaseException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly source?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
