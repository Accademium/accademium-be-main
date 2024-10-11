import { CountryEnum } from 'src/utils/enums/country.enum';

export class CityDTO {
  id: string;
  name: string;
  description: string;
  housingAvailability: number;
  nightlife: number;
  societalInclusion: number;
  workOpportunities: number;
  safety: number;
  country: CountryEnum;
}
