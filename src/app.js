let express = require('express');
let ejsLocals = require('ejs-locals');
let path = require('path');
let morgan = require('morgan');
// let connectLiveReload = require('connect-livereload');

let directory = require('./directory');

let app = express();
// view engine setup
app.engine('ejs', ejsLocals);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(morgan(':method :url :status (done after :response-time ms)'));
// Static routes
app.use(express.static(path.join(__dirname, '../public')));
// // LiveReload javascript
// app.use(connectLiveReload({ port: 35729 }));
// Dynamic routes
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
