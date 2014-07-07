module path from 'path';
module express from 'express';
module http from 'http';
module morgan from 'morgan';
module requestHandler from './server-express-handler';
module errorTemplate from './templates/error';

function startServer(options) {
	// options.directory
	// options.port

	var app = express();

	app.use(morgan(':method :url :status (done after :response-time ms)'));

	app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }));

	app.use(requestHandler(options.directory));

	// development error handler
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.end(errorTemplate.render(err));
	});

	var server = http.createServer(app);
	server.listen(options.port);
	return server;
}

export default startServer;