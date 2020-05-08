// Endpoint user is re-directed to after a
// successful S3 upload

const htmlResponse = require('./html-response');
const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.lambdaHandler = async (event, context) => {
    const params = {
        Bucket: process.env.UPLOAD_S3_BUCKET,
        Key: event.queryStringParameters.key,
        Expires: 300
    };
    // get temporary signed Url to allow download
    const url = s3.getSignedUrl('getObject', params);
    const responseText = `
        <html>
        <body>
            <h1>Thanks</h1>
            <a href="${url}">check your upload</a> (link expires in 5 minutes)
        </body>
        </html>
    `;
    return htmlResponse(responseText);
};