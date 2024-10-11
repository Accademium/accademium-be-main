import { CountryEnum } from 'src/utils/enums/country.enum';

export class CreateCityDTO {
  name: string;
  description: string;
  housingAvailability: number;
  nightlife: number;
  societalInclusion: number;
  workOpportunities: number;
  safety: number;
  country: CountryEnum;
}
