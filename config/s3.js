import AWS from "aws-sdk";
/*
  Configure S3 client using Railway Bucket credentials
*/
const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
  signatureVersion: "v4",
});

export default s3;
