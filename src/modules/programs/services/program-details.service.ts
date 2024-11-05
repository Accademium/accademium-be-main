import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ProgramDetails } from '../dtos/program-details.dto';
import { ProgramDetailsRepository } from '../repositories/program-details.repository';
import { AwsException } from 'src/utils/exceptions/aws.exception';
import { ErrorHandlingService } from 'src/utils/services/error-handling.service';

@Injectable()
export class ProgramDetailsService {
  private readonly SERVICE_NAME = 'ProgramCoreService';
  private readonly logger = new Logger(ProgramDetailsService.name);

  constructor(
    private readonly programDetailsRepository: ProgramDetailsRepository,
    private readonly errorHandlingService: ErrorHandlingService,
  ) {}

  async findProgramDetails(
    id: string
  ): Promise<ProgramDetails> {
    try {
      return await this.programDetailsRepository.findById(id);
    } catch (error) {
      throw this.handleDynamoError(
        error,
        `Failed to get program details with id=${id}`,
        'GET_PROGRAM_CORE_ERROR',
      );
    }
  }

  async createProgramDetailsList(
    programDetailsList: ProgramDetails[],
  ): Promise<void> {
    this.logger.log(
      `New chunk with project-details data (${programDetailsList.length} objects) is being processed.`,
    );
    await Promise.all(
      programDetailsList.map(async (programDetails) => {
        await this.createProgramDetails(programDetails);
      }),
    );
  }

  async createProgramDetails(
    programDetails: ProgramDetails,
  ): Promise<ProgramDetails> {
    //TODO create retry on ProvisionedThroughputExceededException
    try {
      return await this.programDetailsRepository.create(programDetails);
    } catch (error) {
      this.logger.error(error.stack);
    }
  }

  async updateProgramDetails(
    key: string,
    program: Partial<ProgramDetails>,
  ): Promise<ProgramDetails> {
    return await this.programDetailsRepository.update(key, program);
  }

  async findProgramsByStudyType(study_type: string) {
    try {
      return await this.programDetailsRepository.findByStudyType(study_type);
    } catch (error) {
      console.error('Failed to get programs by study type', error);
      throw this.handleDynamoError(
        error,
        'Failed to get programs by field',
        'GET_PROGRAMS_BY_FIELD_ERROR',
      );
    }
  }

  /**
   * Handles errors occurring during DynamoDB operations and logs them.
   * @param error - The exception thrown during DynamoDB operations.
   * @param message - The custom error message to be logged.
   * @param code - The specific error code corresponding to the operation that failed.
   * @throws {AwsException} Re-throws the error with a custom message and code.
   */
  private handleDynamoError(
    //TODO move to exception service
    error: AwsException,
    message: string,
    code: string,
  ): never {
    this.logger.error(message);
    this.logger.error(error);
    throw this.errorHandlingService.createAwsException(
      error,
      message,
      code,
      HttpStatus.INTERNAL_SERVER_ERROR,
      this.SERVICE_NAME,
    );
  }
}
