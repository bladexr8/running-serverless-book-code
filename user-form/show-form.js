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
const errorResponse = require('./error-response');
const RequestProcessor = require('./request-processor');
const S3PolicySigner = require('./s3-policy-signer');

exports.lambdaHandler = async (event, context) => {
    try {
        const uploadSigner = new S3PolicySigner(process.env.UPLOAD_S3_BUCKET);
        const downloadSigner = new S3PolicySigner(process.env.THUMBNAILS_S3_BUCKET);
        const requestProcessor = new RequestProcessor(
            uploadSigner,
            downloadSigner,
            parseInt(process.env.UPLOAD_LIMIT_IN_MB),
            process.env.ALLOWED_IMAGE_EXTENSIONS.split(',')
        );
        const result = requestProcessor.processRequest(
            context.awsRequestId,
            event.pathParameters.extension
        );
        return jsonResponse(result, process.env.CORS_ORIGIN);
    } catch (e) {
        return errorResponse(e, process.env.CORS_ORIGIN);
    }
};