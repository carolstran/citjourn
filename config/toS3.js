const fs = require('fs');
const knox = require('knox');
const creds = require('./passwords.json');

const client = knox.createClient({
    key: creds.awsKey,
    secret: creds.awsSecret,
    bucket: 'citjourn'
});

module.exports = file => {
    return new Promise((resolve, reject) => {
        const req = client.put(file.filename, {
            'Content-Type': file.mimetype,
            'Content-Length': file.size,
            'x-amz-acl': 'public-read'
        }).on('response', (res) => res.statusCode == 200 ? resolve() : reject(res.statusCode));
        const readStream = fs.createReadStream(file.path);
        readStream.pipe(req);
    });
};
