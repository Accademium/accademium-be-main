import { Injectable } from "@nestjs/common";
import { BaseMapper } from "src/utils/mappers/base.mapper";
import { Application } from "../entities/application.entity";
import { ApplicationAggregatedDto } from "../dto/application-dtos/application.dto";

@Injectable()
export class ApplicationAggregatedMapper extends BaseMapper<Application, ApplicationAggregatedDto> {
    constructor() {
        super(ApplicationAggregatedDto);
    }
}