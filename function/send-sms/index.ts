import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { SNSEvent } from "aws-lambda";

exports.handler = async (event: SNSEvent) => {
  const sns = new SNSClient(process.env.REGION || 'us-east-1');
  const phoneNumber = process.env.PHONE_NUMBER;

  const publishCommand = new PublishCommand({
    Message: "This is a test message",
    PhoneNumber: phoneNumber,
  })

  await sns.send(publishCommand);

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/json" },
    body: JSON.stringify({
      message: "Hello from my Lambda function",
      event,
    })
  }
}