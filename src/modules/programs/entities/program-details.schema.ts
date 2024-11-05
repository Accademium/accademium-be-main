import { count } from 'console';
import { Schema } from 'dynamoose/dist/Schema';

export const ProgramDetailsSchema = new Schema({
  programId: {
    type: String,
    hashKey: true,
    required: true
  },
  programName: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  ects: {
    type: Number,
    required: true
  },
  graduationTitle: {
    type: String,
    required: true
  },
  fees: {
    type: Object,
    schema: {
      eea: {
        type: Number,
        required: true
      },
      nonEea: { 
        type: Number,
        required: true
      },
      institutional: {
        type: Number,
        required: true
      }
    },
    required: true
  },
  deadlines: {
    type: Object,
    schema: {
      eea: {
        type: String,
        required: true
      },
      nonEea: {
        type: String,
        required: true
      }
    },
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  applicationRequirements: {
    type: Array,
    schema: [String],
    required: true
  },
  languageRequirements: {
    type: Array,
    schema: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  studyinnlLink: {
    type: String,
    required: false
  },
  programWebsite: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  universityType: {
    type: String,
    required: true
  },
  universityLogoLink: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});