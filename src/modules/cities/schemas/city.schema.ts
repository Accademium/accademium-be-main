import { Schema } from 'dynamoose';

export const CitySchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
    required: true,
    
  },
  description: String,
  housingAvailability: {
    type: Number,
    required: true,
  },
  nightlife: {
    type: Number,
    required: true,
  },
  societalInclusion: {
    type: Number,
    required: true,
  },
  workOpportunities: {
    type: Number,
    required: true,
  },
  safety: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});