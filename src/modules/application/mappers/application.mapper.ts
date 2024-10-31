import { Injectable } from '@nestjs/common';
import { Application } from '../entities/application.entity';
import { BaseMapper } from 'src/utils/mappers/base.mapper';
import { ApplicationDto } from '../dto/application-dtos/application.dto';

@Injectable()
export class ApplicationMapper extends BaseMapper<Application, ApplicationDto> {
    constructor() {
        super(ApplicationDto);
    }
}