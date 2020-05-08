// conversion needs to download S3 object into a local file
// to produce thumbnails, and upload resulting image to S3
// this function contains utility methods to support this
// Note use of file streams to reduce memory usage

const aws = require('aws-sdk'),
    fs = require('fs'),
    s3 = new aws.S3(),
    downloadFileFromS3 = function (bucket, fileKey, filePath) {
        console.log('downloading', bucket, fileKey, filePath);
        return new Promise((resolve, reject) => {
            // input and output streams
            const file = fs.createWriteStream(filePath),
                stream = s3.getObject({
                    Bucket: bucket,
                    Key: fileKey
                }).createReadStream();
            stream.on('error', reject);
            file.on('error', reject);
            file.on('finish', () => {
                console.log('downloaded', bucket, fileKey);
                resolve(filePath);
            });
            // stream S3 file to output stream (file)
            stream.pipe(file);
        });
    },
    uploadFileToS3 = function (bucket, fileKey, filePath, contentType) {
        console.log('uploading', bucket, fileKey, filePath, contentType);
        return s3.upload({
            Bucket: bucket,
            Key: fileKey,
            Body: fs.createReadStream(filePath),
            ACL: 'private',
            ContentType: contentType
        }).promise();
    };

    module.exports = {
        downloadFileFromS3: downloadFileFromS3,
        uploadFileToS3: uploadFileToS3
    };