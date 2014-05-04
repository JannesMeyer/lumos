module express from 'express'
module ejsLocals from 'ejs-locals'
module path from 'path'
module morgan from 'morgan'
module serve from './serve'

let app = express();

// view engine setup
app.engine('ejs', ejsLocals);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// logger
app.use(morgan(':method :url :status (done after :response-time ms)'));

// static routes
app.use(express.static(path.join(__dirname, '../public')));

// the app
app.use(serve);

// development error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', { err });
});

module.exports = app;
