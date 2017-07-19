const spicedPg = require('spiced-pg');
var dbUrl = process.env.DATABASE_URL || require('./passwords.json').dbUrl;
const db = spicedPg(dbUrl);

// FUNCTIONS
function getImageFeed() {
    let q = `SELECT * FROM images;`;

    return db.query(q, []).then(function(results) {
        results.rows.forEach(row => {
            row.image_url = 'https://s3.amazonaws.com/citjourn-bucket/' + row.image_url;
        });
        return results.rows;
    }).catch(function(err) {
        console.log('Error getImageFeed in DB', err);
        throw err;
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

    return db.query(q, params).then(function(results) {
        results.rows.forEach(row => {
            row.image_url = 'https://s3.amazonaws.com/citjourn-bucket/' + row.image_url;
        });
        return results.rows;
    }).catch(function(err) {
        console.log('Error uploadImage in DB', err);
        throw err;
    });
}

function getSingleImage(id) {
    let q = `SELECT * FROM images WHERE id = $1;`;
    let params = [
        id
    ];

    return db.query(q, params).then(function(result) {
        result.rows.forEach(row => {
            row.image_url = 'https://s3.amazonaws.com/citjourn-bucket/' + row.image_url;
        });
        return result.rows;
    }).catch(function(err) {
        console.log('Error getSingleImage in DB', err);
        throw err;
    });
}

function getCommentsForImage(imageId) {
    let q = `SELECT * FROM comments WHERE image_id = $1;`;
    let params = [
        imageId
    ];

    return db.query(q, params).then(function(results) {
        return results;
    }).catch(function(err) {
        console.log('Error getCommentsForImage in DB', err);
        throw err;
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

    return db.query(q, params).then(function(result) {
        return result.rows;
    }).catch(function(err) {
        console.log('Error postComment in DB', err);
        throw err;
    });
}

function addVerifyToSingleImage(numberOfVerified, imageId) {
    let q = `UPDATE images SET verified = $1 WHERE id = $2;`;
    let params = [
        numberOfVerified,
        imageId
    ];

    return db.query(q, params).then(function(results) {
        return results;
    }).catch(function(err) {
        console.log('Error addVerifyToSingleImage in DB', err);
        throw err;
    });
}

// EXPORTS
module.exports.getImageFeed = getImageFeed;
module.exports.uploadImage = uploadImage;
module.exports.getSingleImage = getSingleImage;
module.exports.getCommentsForImage = getCommentsForImage;
module.exports.postComment = postComment;
module.exports.addVerifyToSingleImage = addVerifyToSingleImage;
