import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'YOUR_ACTUAL_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_ACTUAL_SECRET_ACCESS_KEY',
  },
});

export const S3_BUCKET = 'insure-it';