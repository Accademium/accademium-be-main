import * as dynamoose from 'dynamoose';

export const applicationSchema = new dynamoose.Schema({
  applicationId: {
    type: String,
    hashKey: true,
  },
  userId: {
    type: String,
    required: true,
    index: { 
      name: 'UserIndex',
      type: 'global'
    },
  },
  status: {
    type: String,
    // required: true,
  },
  creationDate: {
    type: Date,
    default: () => new Date(),
  },
  lastUpdatedDate: {
    type: Date,
    default: () => new Date(),
  },
  universityId: {
    type: String,
    // required: true,
  },
  universityName: {
    type: String,
    // required: true,
  },
  submissionDate: {
    type: Date,
  },
  mentorId: {
    type: String,
  },
  adminId: {
    type: String,
  },
  notes: {
    type: String,
  },
  requiredDocuments: {
    type: Array,
    schema: [String],
  },
}, {
  timestamps: true, 
});
