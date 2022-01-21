import { Stack, StackProps } from "aws-cdk-lib";
import { Function, InlineCode, Runtime } from "aws-cdk-lib/aws-lambda";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";


export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const phoneNumber = Secret.fromSecretNameV2(this, "PhoneNumber", "myPersonalIdentifiableInformation");
    console.log("Secret:", phoneNumber);
    console.log("Phone Number:", phoneNumber.secretValueFromJson('phoneNumber'));

    new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: new InlineCode('exports.handler = _ => "Hello, CDK";'),
      environment: {
        SECRET_NAME: phoneNumber.secretName,
        SECRET_VALUE: phoneNumber.secretValueFromJson('phoneNumber').toString(),
      }
    });
  }
}
