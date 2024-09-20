import * as dynamoose from 'dynamoose';

export const applicationDocumentSchema = new dynamoose.Schema({
  documentId: {
    type: String,
    hashKey: true,
  },
  applicationId: {
    type: String,
    required: true,
    index: {
      name: 'ApplicationIdIndex',
      type: 'global'
    },
  },
  userId: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  approvalStatus: {
    type: String,
    required: true,
  },
  approvedBy: {
    type: String,
  },
  approvalDate: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  version: {
    type: Number,
    default: 1, // Default version is 1
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});
