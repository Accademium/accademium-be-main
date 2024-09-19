import { CountryEnum } from "src/utils/enums/country.enum";
import { CityKey } from "src/utils/interfaces/keys";

export interface City extends CityKey {
  name: string;
  description: string;
  housingAvailability: number;
  nightlife: number;
  societalInclusion: number;
  workOpportunities: number;
  safety: number;
  country: CountryEnum;
}
