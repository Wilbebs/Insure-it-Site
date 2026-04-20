import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({ region: "us-east-1" });

export const S3_BUCKET = process.env.S3_BUCKET_NAME || "insure-it";
