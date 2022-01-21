import { Stack, StackProps } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";


export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const phoneNumber = Secret.fromSecretNameV2(this, "PhoneNumber", "myPersonalIdentifiableInformation");
    // console.log("Secret:", phoneNumber);
    // console.log("Phone Number:", phoneNumber.secretValueFromJson('phoneNumber'));

    new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'send-sms.handler',
      code: Code.fromAsset('app'),
      environment: {
        PHONE_NUMBER: phoneNumber.secretValueFromJson('phoneNumber').toString(),
        REGION: this.region,
      }
    });
  }
}
