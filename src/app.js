let express = require('express');
let ejsLocals = require('ejs-locals');
let path = require('path');
let morgan = require('morgan');
// let connectLiveReload = require('connect-livereload');

let serve = require('./serve');

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
app.use(serve);

// development error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

module.exports = app;
