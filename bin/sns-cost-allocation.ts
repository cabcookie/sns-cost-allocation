#!/usr/bin/env node
// import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { SnsCostAllocationStack } from '../lib/sns-cost-allocation-stack';

const app = new App();
new SnsCostAllocationStack(app, 'SnsCostAllocationStack');
