const express            = require('express')
const AWS                = require('aws-sdk')
const s3Uploads          = require('../services/s3Uploader')
const cryptoRandomString = require('crypto-random-string');
const path               = require('path')

const router             = express.Router()

/* Web page with upload form */
router.get('/', function(req, res, next) {
  res.render('index', {
    title         : 'S3 Direct Uploader',
    S3_OBJECT_ACL : process.env.S3_OBJECT_ACL,
    S3_BUCKET     : process.env.S3_BUCKET,
  });
});

/* Pass a presigned s3 upload URL and the random s3Key back to the client */
router.post('/signed-url-put-object', async (req, res) => {
  let extension = path.extname(req.body.name),
      s3Key = `${cryptoRandomString({length: 10})}${extension}`,
      signedURL = await s3Uploads.getURL(s3Key, req.body.type)

  return res.json({
    signedURL,
    s3Key
  })
  
})

module.exports = router;