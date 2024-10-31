import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseMapper<Entity, Dto> {
    constructor(private readonly dtoClass: ClassConstructor<Dto>) {}

    toDto(entity: Entity): Dto {
        return plainToInstance(this.dtoClass, entity, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
        });
    }

    toDtoArray(entities: Entity[]): Dto[] {
        return entities.map(entity => this.toDto(entity));
    }
}