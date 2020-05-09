// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
// let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

const jsonResponse = require('./json-response');
const buildForm = require('./build-form');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const uploadLimitInMB = parseInt(process.env.UPLOAD_LIMIT_IN_MB);


exports.lambdaHandler = async (event, context) => {
    console.log(JSON.stringify(event, null, 2));

    const key = context.awsRequestId + '.png',
    uploadParams = {
        Bucket: process.env.UPLOAD_S3_BUCKET,
        Expires: 300,
        Conditions: [
            ['content-length-range', 1, uploadLimitInMB * 1000000]
        ],
        Fields: {
            acl: 'private',
            key: key
        }
    },
    uploadForm = s3.createPresignedPost(uploadParams);

    downloadParams = {
        Bucket: process.env.THUMBNAILS_S3_BUCKET,
        Key: key,
        Expires: 300
    },
    downloadUrl = s3.getSignedUrl('getObject', downloadParams);
   
    // send back a pre-built form for S3 upload
    return jsonResponse({
        upload: uploadForm,
        download: downloadUrl
    });
};
