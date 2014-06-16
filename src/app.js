module path from 'path';
module express from 'express';
module morgan from 'morgan';
module serve from './serve';
module api from './api';
module errorTemplate from './templates/error';

var app = express();

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
    res.end(errorTemplate.render(err));
});

module.exports = app;