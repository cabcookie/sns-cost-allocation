import { StackProps, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { HandleSnsSmsMessages } from "./lambda-stack";

export class PipelineAppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaStack = new HandleSnsSmsMessages(this, 'HandleSnsSmsMessagesStack');
  }
}
