import { CountryEnum } from "src/utils/enums/country.enum";

export interface City extends CityKey{
  name: string;
  description: string;
  housingAvailability: number;
  nightlife: number;
  societalInclusion: number;
  workOpportunities: number;
  safety: number;
  country: CountryEnum;
}

export interface CityKey {
  id: string;
}