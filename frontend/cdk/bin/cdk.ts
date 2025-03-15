#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ReactAppCdkStack } from '../lib/react-app-cdk-stack';

const app = new cdk.App();
new ReactAppCdkStack(app, 'ReactAppCdkStack');
