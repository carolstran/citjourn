const spicedPg = require('spiced-pg');
const dbUrl = require('./passwords.json').dbUrl;
const db = spicedPg(dbUrl);

// FUNCTIONS
function getImageFeed() {
    let q = `SELECT * FROM images;`;

    return new Promise(function(resolve, reject) {
        db.query(q, []).then(function(results) {
            resolve(results.rows);
        }).catch(function(err) {
            console.log('Unable to get image feed', err);
            reject(err);
        });
    });
}

function uploadImage(file, username, title, description) {
    let q = `INSERT INTO images (image_url, username, title, description)
             VALUES ($1, $2, $3, $4);`;
    let params = [
        file,
        username,
        title,
        description
    ];

    return new Promise(function(resolve, reject) {
        db.query(q, params).then(function(results) {
            results.rows.forEach(row => {
                row.image_url = 'https://s3.amazonaws.com/citjourn/' + row.image_url;
            });
            resolve(results.rows);
        }).catch(function(err) {
            console.log('Unable to upload image', err);
            reject(err);
        });
    });
}

function getSingleImage(id) {
    let q = `SELECT * FROM images WHERE id = $1;`;
    let params = [
        id
    ];

    return new Promise(function(resolve, reject) {
        db.query(q, params).then(function(result) {
            resolve(result.rows);
        }).catch(function(err) {
            console.log('Unable to retrieve single image', err);
            reject(err);
        });
    });
}

function getCommentsForImage(imageId) {
    let q = `SELECT * FROM comments WHERE image_id = $1;`;
    let params = [
        imageId
    ];

    return new Promise(function(resolve, reject) {
        db.query(q, params).then(function(results) {
            // console.log('These are the results of the query', results);
            resolve(results);
        }).catch(function(err) {
            console.log('Unable to get comments', err);
            reject(err);
        });
    });
}

function postComment(imageId, username, comment) {
    let q = `INSERT INTO comments (image_id, username, comment)
             VALUES ($1, $2, $3);`;
    let params = [
        imageId,
        username,
        comment
    ];

    return new Promise(function(resolve, reject) {
        db.query(q, params).then(function(result) {
            resolve(result.rows);
        }).catch(function(err) {
            console.log('Unable to post comment', err);
            reject(err);
        });
    });
}

function addVerifyToSingleImage(numberOfVerified, imageId) {
    let q = `UPDATE images SET verified = $1 WHERE id = $2;`;
    let params = [
        numberOfVerified,
        imageId
    ];

    return new Promise(function(resolve, reject) {
        db.query(q, params).then(function(results) {
            resolve(results);
        }).catch(function(err) {
            console.log('Unable to add verify', err);
            reject(err);
        });
    });
}

// EXPORTS
module.exports.getImageFeed = getImageFeed;
module.exports.uploadImage = uploadImage;
module.exports.getSingleImage = getSingleImage;
module.exports.getCommentsForImage = getCommentsForImage;
module.exports.postComment = postComment;
module.exports.addVerifyToSingleImage = addVerifyToSingleImage;
