# sns-cost-allocation

Build a solution to allocate costs for text messages to callers.

Usually, if you want to send a text message you call SNS like follows:

```js
var AWS = require('aws-sdk');
AWS.config.update({region: 'REGION'});

var params = {
  Message: 'TEXT_MESSAGE',
  PhoneNumber: 'E.164_PHONE_NUMBER',
};

new AWS.SNS({apiVersion: '2010-03-31'}).publish(params);
```

However, doing this, you have no chance to allocate costs for sending text messages to the caller.
This code example shows you how to send your request to an SNS Topic instead and a Lambda function handles the request, sends the message and records the caller. Thus, if you match the logs of the Lambda with your cost and usage reports, you have a chance to allocate the costs to the consumer of the service.

You would then call the topic as follows:

```js
var AWS = require('aws-sdk');
AWS.config.update({region: 'REGION'});

var params = {
  Message: JSON.stringify({
    Message: 'TEXT_MESSAGE',
    PhoneNumber: 'E.164_PHONE_NUMBER',
    Caller: 'WHO_AM_I',
  }),
  Topic: 'TOPIC_ARN'
};

new AWS.SNS({apiVersion: '2010-03-31'}).publish(params);
```

If you then send a message like the following: 

```js
var params = {
  Message: JSON.stringify({
    Message: 'Hello dear customer, I am happy to remind you about your upcoming reservation.',
    Caller: 'RemindCustomerAboutUpcomingReservation',
  }),
  Topic: 'TOPIC_ARN'
};
```

... you will find the following information in the CloudWatch logs of the Lambda function:

```
2022-01-21T19:36:19.995Z	e4230523-7b5b-433b-8f91-2c68b9cb5125	INFO	{
  Message: 'Hello dear customer, I am happy to remind you about your upcoming reservation.',
  Caller: 'RemindCustomerAboutUpcomingReservation',
  MessageId: '3b00b4e6-6eb3-5187-8045-ee837bdaccd0',
  PhoneNumber: '+491...'
}
```

## Preparation

You need to manually create secrets within [AWS Secrets Manager](https://console.aws.amazon.com/secretsmanager/home?/listSecrets/), as this stack is looking for them:

- `github-token` – Create a developer token with permissions for creating hooks.
- `myPersonalIdentifiableInformation` – Store a default number with secret key `phoneNumber`. This will be used for testing purposes.

If your account is in the SMS sandbox (i.e., check the *[Account Information](https://console.aws.amazon.com/sns/v3/home?%2Fmobile%2Ftext-messaging=&#/mobile/text-messaging)*), then add the `phoneNumber` from `myPersonalIdentifiableInformation` to the *Sandbox destination phone numbers*.

Before CDK can deploy resources in your account, you need to run the following statements in your environment:

```bash
export CDK_NEW_BOOTSTRAP=1 
npx cdk bootstrap aws://[ACCOUNT-ID]/[REGION] \
    --profile ADMIN-PROFILE \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```

**--cloudformation-execution-policies** specifies the ARN of a policy under which future CDK Pipelines deployments will execute. The default `AdministratorAccess` policy ensures that your pipeline can deploy every type of AWS resource. If you use this policy, make sure you trust all the code and dependencies that make up your AWS CDK app.

Most organizations mandate stricter controls on what kinds of resources can be deployed by automation. Check with the appropriate department within your organization to determine the policy your pipeline should use.

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
