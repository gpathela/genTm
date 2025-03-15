import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export class ReactAppCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for React app
    const bucket = new s3.Bucket(this, 'ReactAppBucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'ReactAppDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
      defaultRootObject: 'index.html',
    });

    // Deploy React build folder to S3
    new s3deploy.BucketDeployment(this, 'DeployReactApp', {
      sources: [s3deploy.Source.asset('../build')], // Path to your React build folder
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Output CloudFront URL
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: distribution.domainName,
    });
  }
}