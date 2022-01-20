#!/usr/bin/env node
// import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SnsCostAllocationStack } from '../lib/sns-cost-allocation-stack';

const app = new cdk.App();
new SnsCostAllocationStack(app, 'SnsCostAllocationStack', {
  env: {
    account: '711568858726',
    region: 'eu-west-1',
  },
});
