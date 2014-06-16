module path from 'path'
module express from 'express'
module ejsLocals from 'ejs-locals'
module morgan from 'morgan'
module serve from './serve'
module api from './api'

var app = express();

// view engine setup
app.engine('ejs', ejsLocals);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// logger
app.use(morgan(':method :url :status (done after :response-time ms)'));

// static routes
var oneYear = 31557600000;
app.use(express.static(path.join(__dirname, '../public'), { maxAge: oneYear }));

// the app
app.use(serve);

// development error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', { err });
});

module.exports = app;