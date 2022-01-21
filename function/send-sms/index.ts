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

  const records: SmsMessage[] = event.Records.map(record => {
    const { Message, MessageId } = record.Sns;
    const smsMessage: SmsMessage = JSON.parse(Message);
    smsMessage.MessageId = MessageId;
    if (!smsMessage.PhoneNumber) {
      smsMessage.PhoneNumber = process.env.PHONE_NUMBER;
    }
    return smsMessage;
  });

  records.forEach(async (smsMessage) => {
    const publishCommand = new PublishCommand({
      Message: smsMessage.Message,
      PhoneNumber: smsMessage.PhoneNumber,
    })
    await sns.send(publishCommand);
    console.log(smsMessage);
  });

  const responseBody = {
    message: "Successfully sent messages.",
    event: JSON.stringify(event),
  };
  console.log(responseBody);

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/json" },
    body: JSON.stringify(responseBody),
  }
}