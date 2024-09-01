import { Injectable, Logger } from '@nestjs/common';
import { AccademiumException } from '../exceptions/accademium.exception'
import { AwsException } from '../exceptions/aws.exception';

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
    handleError(error: Error, context: string): void 
    {
        if (error instanceof AwsException) 
        {
            this.logger.error(`[AWS:${error.awsErrorCode}] ${error.message} in ${context}`, 
                {
                    stack: error.stack,
                    requestId: error.requestId,
                    serviceSpecificDetails: error.serviceSpecificDetails,
                });
        } 
        else if (error instanceof AccademiumException) 
        {
            this.logger.error(`[${error.code}] ${error.message} in ${context}`, error.stack);
        } 
        else 
        {
            this.logger.error(`Unexpected error in ${context}: ${error.message}`, error.stack);
        }
        // TODO additional error handling logic 
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
        source?: string
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
        source: string
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
            this.extractAwsServiceDetails(awsError)
        );
    }

    private extractAwsServiceDetails(awsError: any): Record<string, any> {
        // TODO expand based on your needs
        const details: Record<string, any> = {};

        if (awsError.name === 'ValidationException') 
        {
            details.validationErrors = awsError.errors;
        } 
        else if (awsError.name === 'ResourceNotFoundException') 
        {
            details.resourceType = awsError.resourceType;
            details.resourceId = awsError.resourceId;
        }

        return details;
    }
}