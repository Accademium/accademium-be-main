import { BaseException } from "./base.exception";

/**
 * An Exception class for application-specific errors.
 * 
 * This Error should be thrown in the Service-Layer using ErrorHandlingService and automatically handled by the filter.
 */
export class AccademiumException extends BaseException {}