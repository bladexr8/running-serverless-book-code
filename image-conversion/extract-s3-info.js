// utility function to extract required
// info from an S3 event triggering
// a Lambda function

module.exports = function extractS3Info(event) {
    const eventRecord = event.Records && event.Records[0],
        bucket = eventRecord.s3.bucket.name,
        key = eventRecord.s3.object.key;
    return {bucket, key};
}