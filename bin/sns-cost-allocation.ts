#!/usr/bin/env node
// import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SnsCostAllocationStack } from '../lib/sns-cost-allocation-stack';
import awsEnvironment from '../secrets/aws-environment';

const app = new cdk.App();
new SnsCostAllocationStack(app, 'SnsCostAllocationStack', {
  env: awsEnvironment,
});
