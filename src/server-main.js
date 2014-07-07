import path from 'path';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import requestHandler from './server-express-handler';
import errorTemplate from './templates/error';

function startServer(options) {
	// options.directory
	// options.port

	var app = express();
	var server = http.createServer(app);

	app.use(morgan(':method :url :status (done after :response-time ms)'));
	app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }));
	app.use(requestHandler(options.directory));

	// development error handler
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.end(errorTemplate.render(err));
	});

	server.listen(options.port, () => {
		// Debug: Server started
	});
	return server;
}

export default startServer;