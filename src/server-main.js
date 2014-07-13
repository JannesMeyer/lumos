import path from 'path';
import express from 'express';
import socket_io from 'socket.io';
import http from 'http';
import morgan from 'morgan';
import requestHandler from './server-express-handler';
import errorTemplate from './templates/error';

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

	// Create server
	var server = http.createServer(app);
	var io = socket_io(server);

	// Socket.io
	// var socketlist = [];
	var namespace = io.of('/');
	io.on('connection', socket => {
		// socketlist.push(socket);
		console.log('client connected', Object.keys(namespace.connected));

		socket.on('disconnect', () => {
			// socketlist.splice(socketlist.indexOf(socket), 1);
			console.log('client disconnected', Object.keys(namespace.connected));
		});
	});

	server.listen(options.port, () => {
		console.log('HTTP server started');
	});
	return server;
}

export default startServer;