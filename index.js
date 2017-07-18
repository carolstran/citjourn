const express = require('express');
const app = express();
const db = require('./config/db');
const toS3 = require('./config/toS3');

const bodyParser = require('body-parser');
const multer = require('multer');

// STATIC DIRECTORIES
app.use('/public', express.static(`${__dirname}/public`));
app.use('/uploads', express.static(`${__dirname}/uploads`));
app.use('/app', express.static(`${__dirname}/public/app`));
app.use('/views', express.static(`${__dirname}/public/views`));

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));

// MULTER MIDDLEWARE
var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, `${__dirname}/uploads`);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});

// ROUTE REQUESTS
app.get('/imageFeed', function(req, res) {
    db.getImageFeed().then(function(results) {
        if (results) {
            res.json({
                success: true,
                feed: results
            });
        } else {
            res.json({
                success: false
            });
        }
    }).catch(function(err) {
        console.log('Unable to get image feed', err);
    });
});

app.post('/uploadImage', uploader.single('file'), function(req, res) {
    let file = `${req.file.filename}`;
    let username = req.body.username;
    let title = req.body.title;
    let description = req.body.description;

    if (req.file) {
        toS3.makeS3Request(req, res, function(result) {
            db.uploadImage(file, username, title, description).then(function(results) {
                res.json({
                    success: true
                });
            }).catch(function(err) {
                console.log('Unable to upload image', err);
            });
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.get('/singleImage/:id', function(req, res) {
    db.getSingleImage(req.params.id).then(function(result) {
        res.send(result);
    }).catch(function(err) {
        console.log('Unable to show image', err);
    });
});

app.get('/commentsForImage/:id', function(req, res) {
    db.getCommentsForImage(req.params.id).then(function(results) {
        if (results.rows) {
            res.json({
                success: true,
                comments: results.rows
            });
        } else {
            res.json({
                success: false
            });
        }
    }).catch(function(err) {
        console.log('Unable to get comments for image', err);
    });
});

app.post('/newComment/:id', function(req, res) {
    let imageId = req.params.id;
    let username = req.body.username;
    let comment = req.body.comment;

    db.postComment(imageId, username, comment).then(function(result) {
        if (result) {
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false
            });
        }
    }).catch(function(err) {
        console.log('Unable to show new comment', err);
    });
});

app.post('/singleVerify/:id', function(req, res) {
    let numberOfVerified = req.body.verified;
    let imageId = req.params.id;

    db.addVerifyToSingleImage(numberOfVerified, imageId).then(function(results) {
        res.send(results);
    }).catch(function(err) {
        console.log('Unable to add verify', err);
    });
});

app.get('*', function(req, res) {
    res.sendFile(`${__dirname}/public/index.html`);
});

// SERVER
app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on 3000');
});
