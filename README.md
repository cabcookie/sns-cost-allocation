# sns-cost-allocation

Build a solution to allocate costs for text messages to callers.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Preparation

You need to manually create secrets within [AWS Secrets Manager](https://console.aws.amazon.com/secretsmanager/home?/listSecrets/), as this stack is looking for them:

- `github-token` – Create a developer token with permissions for creating hooks.

You need to manually create parameters within [AWS Systems Manager Parameter Store](https://console.aws.amazon.com/systems-manager/parameters/), as this stack is looking for them:

- `/sns-cost-allocation/github-repo` – Create a developer token with permissions for creating hooks.
- `/sns-cost-allocation/environments/pipeline/account` – The AWS Account ID for the pipeline.
- `/sns-cost-allocation/environments/development/account` – The AWS Account ID where the pipeline should create the resources in the development account.
- `/sns-cost-allocation/environments/production/account` – The AWS Account ID where the pipeline should create the resources in the production account.
- `/sns-cost-allocation/environments/pipeline/region` – The AWS Region for the pipeline.
- `/sns-cost-allocation/environments/development/region` – The AWS Region where the pipeline should create the resources in the development account.
- `/sns-cost-allocation/environments/production/region` – The AWS Region where the pipeline should create the resources in the production account.

Before CDK can deploy resources in those accounts, you need to run the following statements in your above mentioned environments:

```bash
export CDK_NEW_BOOTSTRAP=1 
npx cdk bootstrap aws://[PIPELINE-ACCOUNT-ID]/[REGION] \
    --profile PIPELINE-PROFILE \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```

**--cloudformation-execution-policies** specifies the ARN of a policy under which future CDK Pipelines deployments will execute. The default `AdministratorAccess` policy ensures that your pipeline can deploy every type of AWS resource. If you use this policy, make sure you trust all the code and dependencies that make up your AWS CDK app.

Most organizations mandate stricter controls on what kinds of resources can be deployed by automation. Check with the appropriate department within your organization to determine the policy your pipeline should use.

```bash
export CDK_NEW_BOOTSTRAP=1 
npx cdk bootstrap aws://[DEVELOPMENT-ACCOUNT-ID]/[REGION] \
    --profile DEV-PROFILE \
    --trust [PIPELINE-ACCOUNT-ID]
```

```bash
export CDK_NEW_BOOTSTRAP=1 
npx cdk bootstrap aws://[PRODUCTION-ACCOUNT-ID]/[REGION] \
    --profile PROD-PROFILE \
    --trust [PIPELINE-ACCOUNT-ID]
```

## Get Started

Once you have bootstrapped the resource, you need to deploy the stack by issuing:

```bash
cdk deploy
```

Make sure that your current code is committed and pushed to the GitHub repo with the same name as provided in the secret `sns-cost-allocation/github-repo` before you issue the command.

You only need to issue this command once, as this creates the pipeline. Whenever you push a new version of the code to the GitHub repo, the pipeline will be triggered, mutate itself if the pipeline has been changed and will then deploy the new application version as per the pipeline definition.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
