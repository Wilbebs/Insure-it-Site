import { LambdaClient } from "@aws-sdk/client-lambda";

export const lambdaClient = new LambdaClient({ region: "us-east-1" });

export const LAMBDA_NOTIFICATION_FUNCTION =
  process.env.LAMBDA_NOTIFICATION_FUNCTION || "sendFormNotification";
