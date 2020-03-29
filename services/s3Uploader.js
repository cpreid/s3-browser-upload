const AWS = require('aws-sdk');

AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE})

const getURL = async (key='', filetype='') => {	

  const client = new AWS.S3({
    signatureVersion      : process.env.S3_SIGNATURE_VERSION,
    region                : process.env.S3_REGION,
    // THIS IS NECESSARY FOR ACCELERATED TRANSFERS    
    useAccelerateEndpoint : true,
    // THIS ONE ISN'T NECESSARY
    // endpoint: new AWS.Endpoint(`${process.env.S3_BUCKET}.s3-accelerate.amazonaws.com`),
  });
  
  const signedURL = await (new Promise((resolve, reject) => {
    client.getSignedUrl('putObject', {
      Bucket      : process.env.S3_BUCKET,
      Key         : key,
      Expires     : 60 * 3, // 3 minutes
      ContentType : filetype,
      ACL         : process.env.S3_OBJECT_ACL,
    }, (err, data) => {      
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    });
  }));

  return signedURL

}

module.exports = { getURL }