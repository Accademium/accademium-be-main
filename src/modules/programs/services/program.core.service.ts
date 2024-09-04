import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ProgramCore } from '../interfaces/program-core.interface';
import { ProgramKey } from '../interfaces/program-key.interface';
import { ProgramCoreRepository } from '../repositories/program.core.repository';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';
import { AwsException } from 'src/utils/exceptions/aws.exception';

@Injectable()
export class ProgramCoreService {
    private readonly SERVICE_NAME = 'ProgramCoreService';
    private readonly logger = new Logger(ProgramCoreService.name);

    constructor(
        private programCoreRepository: ProgramCoreRepository,
        private errorHandlingService: ErrorHandlingService
    ) {}

    async getProgramCore(key: ProgramKey): Promise<ProgramCore> {
        try {
            return await this.programCoreRepository.get(key);
        } catch (error) {
            throw this.handleDynamoError(error, 'Failed to get program core', 'GET_PROGRAM_CORE_ERROR');
        }
    }

    async createProgramCore(programCore: ProgramCore): Promise<ProgramCore> {
        try {
            return await this.programCoreRepository.create(programCore);
        } catch (error) {
            throw this.handleDynamoError(error, 'Failed to create program core', 'CREATE_PROGRAM_CORE_ERROR');
        }
    }

    async updateProgramCore(key: ProgramKey, program: Partial<ProgramCore>): Promise<ProgramCore> {
        try {
            return await this.programCoreRepository.update(key, program);
        } catch (error) {
            throw this.handleDynamoError(error, 'Failed to update program core', 'UPDATE_PROGRAM_CORE_ERROR');
        }
    }

    async getProgramsByField(field: string): Promise<ProgramCore[]> {
        try {
            console.log(1);
            return await this.programCoreRepository.findByField(field);
        } catch (error) {
            throw this.handleDynamoError(error, 'Failed to get programs by field', 'GET_PROGRAMS_BY_FIELD_ERROR');
        }
    }

    /**
     * Handles errors occurring during DynamoDB operations and logs them.
     * @param error - The exception thrown during DynamoDB operations.
     * @param message - The custom error message to be logged.
     * @param code - The specific error code corresponding to the operation that failed.
     * @throws {AwsException} Re-throws the error with a custom message and code.
     */
    private handleDynamoError(error: AwsException, message: string, code: string): never {
        this.logger.error(message);
        this.logger.error(error);
        throw this.errorHandlingService.createAwsException(
            error,
            message,
            code,
            HttpStatus.INTERNAL_SERVER_ERROR,
            this.SERVICE_NAME
        );  
    }
}