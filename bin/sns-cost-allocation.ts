#!/usr/bin/env node
// import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { SnsCostAllocationStack } from '../lib/sns-cost-allocation-stack';

const app = new App();
new SnsCostAllocationStack(app, 'SnsCostAllocationStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
