import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProgramMetadataRepository } from '../repositories/program-metadata.repository';
import { CreateProgramMetadataDto, ProgramMetadataDTO, UpdateProgramMetadataDto } from '../dtos/program-metadata.dto';
import { CountryEnum } from 'src/utils/enums/country.enum';
import { AccademiumException } from 'src/utils/exceptions/accademium.exception';
import { AccademiumErrorCode } from 'src/utils/enums/accademium-error-code.enum';

@Injectable()
export class ProgramMetadataService {
  private readonly SERVICE_NAME = 'ProgramMetadataService';
  private readonly logger = new Logger(ProgramMetadataService.name);

  constructor(
    private readonly programRepository: ProgramMetadataRepository,
  ) {}

  /**
   * Retrieves program metadata by its unique ID.
   * @param id - The unique identifier of the program.
   * @returns The program metadata DTO if found.
   * @throws NotFoundException if the program with the specified ID does not exist.
   */
  async findProgramMetadata(id: string): Promise<ProgramMetadataDTO> {
    const program = await this.programRepository.findById(id);
    if (!program) {
      this.logger.error(`No programs with id = ${id} found.`);
      throw new AccademiumException(
        `No program with id = ${id} found.`,
        AccademiumErrorCode.ITEM_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
        this.SERVICE_NAME,
      );
    }
    return program;
  }

  /**
   * Updates the metadata of a specific program by its ID.
   * @param id - The unique identifier of the program.
   * @param updateData - Partial data for updating the program metadata.
   * @returns The updated program metadata DTO.
   * @throws NotFoundException if the program with the specified ID does not exist.
   */
  async updateProgramMetadata(
    id: string,
    updateData: Partial<UpdateProgramMetadataDto>,
  ): Promise<ProgramMetadataDTO> {
    await this.findProgramMetadata(id);
    return await this.programRepository.update(id, updateData);
  }

  /**
   * Retrieves programs based on a specific field of study and degree type.
   * @param field - The field of study to filter programs by.
   * @param degreeType - The degree type to filter programs by.
   * @returns A list of program metadata DTOs matching the specified criteria.
   * @throws {AccademiumException}
   */
  async findProgramsByFieldAndDegreeType(
    field: string, 
    degreeType: string
  ): Promise<ProgramMetadataDTO[]> {
    const programs = await this.programRepository.findByFieldAndType(field, degreeType);
    if (programs.length === 0) {
      this.logger.error(`No programs found for parameters field = ${field} and degree type = ${degreeType}.`);
      throw new AccademiumException(
        `No programs found for parameters field = ${field} and degree type = ${degreeType}.`,
        AccademiumErrorCode.ITEM_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
        this.SERVICE_NAME,
      );
    }
    return programs;
  }

  /**
   * *TODO* Method should be redesigned to suggest sponsored programs
   * TODO 
   * @param name 
   * @param country 
   * @returns 
   * @throws {AccademiumException}
   */
  async findSuggestedProgramsByNameAndCountry(
    name: string, 
    country: CountryEnum
  ): Promise<ProgramMetadataDTO[]> {
    const programs = await this.programRepository.findByGeneralizedNameAndCountry(name, country);
    if (programs.length === 0) {
      this.logger.error(`No programs found for parameters name = ${name} and degree country = ${country}.`);
      throw new AccademiumException(
        `No programs found for parameters name = ${name} and degree country = ${country}.`,
        AccademiumErrorCode.ITEM_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
        this.SERVICE_NAME,
      );
    }
    return programs;  }

  /**
   * Creates multiple program metadata records.
   * @param programMetadataList - Array of program metadata DTOs to be created.
   */
  async createProgramMetadataList(programMetadataList: CreateProgramMetadataDto[]): Promise<void> {
    try {
      await this.programRepository.createMany(programMetadataList);
    } catch (error) {
      const message = `There was an error while persisting ${programMetadataList.length} items in the database. Error occured in table program_metadata. ` + error.message;
      this.logger.error(message);
      throw new AccademiumException(
        message,
        AccademiumErrorCode.ITEM_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
        this.SERVICE_NAME,
      );
    }
  }
}
