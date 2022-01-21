import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";


export class HandleSnsSmsMessages extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const phoneNumber = Secret.fromSecretNameV2(this, "PhoneNumber", "myPersonalIdentifiableInformation");
    // console.log("Secret:", phoneNumber);
    // console.log("Phone Number:", phoneNumber.secretValueFromJson('phoneNumber'));

    const topic = new Topic(this, "SendSmsTopic", {
      displayName: "Request a short message delivery",
    });

    const sendSmsAndRecordCaller = new NodejsFunction(this, 'SendSmsAndRecordCaller', {
      functionName: 'sendSmsAndRecordCaller',
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
      timeout: Duration.seconds(15),
      memorySize: 1024,
      entry: './function/send-sms/index.ts',
      // code: Code.fromAsset('function/send-sms'),
      environment: {
        PHONE_NUMBER: phoneNumber.secretValueFromJson('phoneNumber').toString(),
        REGION: this.region,
      }
    });

    topic.addSubscription(new LambdaSubscription(sendSmsAndRecordCaller));

    new CfnOutput(this, "sendSmsTopicArn", {
      value: topic.topicArn,
      description: "The ARN of the SNS topic to which the Lambda is subscribed to",
    })
  }
}
