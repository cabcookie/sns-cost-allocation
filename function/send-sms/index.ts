import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { SNSEvent } from "aws-lambda";

interface SmsMessage {
  Message: string;
  PhoneNumber?: string;
  Caller: string;
  MessageId?: string;
}

exports.handler = async (event: SNSEvent) => {
  const sns = new SNSClient({
    region: process.env.REGION || 'us-east-1',
  });

  const { Message, MessageId } = event.Records[0].Sns;
  const smsMessage: SmsMessage = JSON.parse(Message);
  smsMessage.MessageId = MessageId;
  if (!smsMessage.PhoneNumber) {
    smsMessage.PhoneNumber = process.env.PHONE_NUMBER;
  }
  const publishCommand = new PublishCommand({
    Message: smsMessage.Message,
    PhoneNumber: smsMessage.PhoneNumber,
  })
  await sns.send(publishCommand);

  const logMessage = {
    ...smsMessage,
    PhoneNumber: smsMessage.PhoneNumber?.substring(0,4) + '...',
  };
  console.log(logMessage);

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/json" },
    body: JSON.stringify({
      message: "Successfully sent messages.",
      event: logMessage,
    }),
  }
}