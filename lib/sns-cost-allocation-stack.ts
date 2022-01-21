import { Stack, StackProps } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineAppStage } from './pipeline-app-stage';

// interface SnsCostAllocationStackProps extends StackProps {
//   secretNames: {
//     githubRepo: string;
//   }
// }

export class SnsCostAllocationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const account = Stack.of(this).account;
    const region = Stack.of(this).region;

    const secretGithubRepoArn = `arn:aws:secretsmanager:${region}:${account}:secret:github-repo`;

    const secret = Secret.fromSecretAttributes(this, "GitHubRepo", {
      secretPartialArn: secretGithubRepoArn,
    });

    const owner = secret.secretValueFromJson('owner');
    const repository = secret.secretValueFromJson('repository');

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'SnsCostAllocation',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub(`${owner}/${repository}`, 'main'),
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
