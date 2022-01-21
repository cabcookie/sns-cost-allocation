const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

exports.handler = async (_event) => {
  const sns = new SNSClient(process.env.REGION);
  const phoneNumber = process.env.PHONE_NUMBER;

  const publishCommand = new PublishCommand({
    Message: "This is a test message",
    PhoneNumber: phoneNumber,
  })

  await sns.send(publishCommand);
}