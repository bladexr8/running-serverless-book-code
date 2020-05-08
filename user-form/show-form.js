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

const htmlResponse = require('./html-response');
const buildForm = require('./build-form');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const uploadLimitInMB = parseInt(process.env.UPLOAD_LIMIT_IN_MB);


exports.lambdaHandler = async (event, context) => {
    console.log(JSON.stringify(event, null, 2));

    // set up info for upload form
    const apiHost = event.requestContext.domainName,
        prefix = event.requestContext.stage,
        redirectUrl = `https://${apiHost}/${prefix}/confirm`,
        params = {
            Bucket: process.env.UPLOAD_S3_BUCKET,
            Expires: 300,
            Conditions: [
                ['content-length-range', 1, uploadLimitInMB * 1000000]
            ],
            Fields: {
                success_action_redirect: redirectUrl,
                acl: 'private',
                key: context.awsRequestId + '.png'
            }
        },
        // get a presigned S3 upload request
        form = s3.createPresignedPost(params);
   
    // send back a pre-built form for S3 upload
    return htmlResponse(buildForm(form));
};
