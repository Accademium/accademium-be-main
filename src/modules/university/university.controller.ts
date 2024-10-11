import { Controller } from '@nestjs/common';
import { UniversityService } from './university.service';

@Controller('api/v1/university/')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}
}
