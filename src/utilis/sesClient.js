const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "eu-north-1";
// Credentials are automatically resolved using the AWS SDK credential provider chain.
// For more information, see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: "AKIAXYKJU727ODUUIH4F",
    secretAccessKey: "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",
  },
});
module.exports = { sesClient };
