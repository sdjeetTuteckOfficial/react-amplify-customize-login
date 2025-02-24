import { Amplify } from 'aws-amplify';

const userPoolId = import.meta.env.VITE_AWS_USER_POLL_ID;
const userPoolClientId = import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID;
const region = import.meta.env.VITE_AWS_REGION;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      region: region,
    },
  },
  // API: {
  //   GraphQL: {
  //     endpoint:
  //       'https://your-app-id.appsync-api.us-east-1.amazonaws.com/graphql', // Replace with your AppSync URL
  //     region: 'us-east-1',
  //     authenticationType: 'AMAZON_COGNITO_USER_POOLS', // Change if using API key
  //   },
  // },
  // Storage: {
  //   S3: {
  //     bucket: 'your-s3-bucket-name',
  //     region: 'us-east-1',
  //   },
  // },
});
