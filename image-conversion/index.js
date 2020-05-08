// lambda handler function
const path = require('path'),
    os = require('os'),
    s3Util = require('./s3-util'),
    extractS3Info = require('./extract-s3-info'),
    silentRemove = require('./silent-remove'),
    OUTPUT_BUCKET = process.env.OUTPUT_BUCKET,
    supportedFormats = ['jpg', 'jpeg', 'png', 'gif'];

exports.handler = async (event, context) => {
    const s3Info = extractS3Info(event),
        id = context.awsRequestId,
        extension = path.extname(s3Info.key).toLowerCase(),
        tempFile = path.join(os.tmpdir(), id + extension),
        extensionWithoutDot = extension.slice(1),
        contentType = `image/${extensionWithoutDot}`;
    console.log('converting', s3Info.bucket, ':', s3Info.key, 'using', tempFile);
    if (!supportedFormats.includes(extensionWithoutDot)) {
        throw new Error(`unsupported file type ${extension}`);
    }
    // get file from S3 and download into temp file
    await s3Util.downloadFileFromS3(s3Info.bucket, s3Info.key, tempFile);
    // transfer temp file to destination bucket
    await s3Util.uploadFileToS3(OUTPUT_BUCKET, s3Info.key, tempFile, contentType);
    // remove temp file (cleanup)
    await silentRemove(tempFile);
}