'use strict';

let express = require('express');
// let expressHelpers = require('express-helpers');
let ejsLocals = require('ejs-locals');
let stylus = require('stylus');
let path = require('path');
let morgan = require('morgan');
let directory = require('./directory');

let app = express();
// view engine setup
// expressHelpers(app);
app.engine('ejs', ejsLocals);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(directory);

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        // will print stacktrace
        error: err
    });
});

module.exports = app;
