const fs = require('fs');
const knox = require('knox');

let creds;
if (process.env.NODE_ENV == 'production') {
    creds = process.env;
} else {
    creds = require('./passwords.json');
}

const client = knox.createClient({
    key: creds.AWS_KEY,
    secret: creds.AWS_SECRET,
    bucket: 'citjourn-bucket'
});

const makeS3Request = (req, res, next) => {
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);
    s3Request.on('response', s3Response => {
        if (s3Response.statusCode == 200) {
            next();
        } else {
            console.log(s3Response.statusCode);
            res.json({ success: false });
        }
    });
};

module.exports.makeS3Request = makeS3Request;
