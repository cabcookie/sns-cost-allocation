import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineAppStage } from './pipeline-app-stage';

export class SnsCostAllocationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'SnsCostAllocation',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('cabcookie/sns-cost-allocation', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    const stage = pipeline.addStage(new PipelineAppStage(this, "test"));
  }
}
