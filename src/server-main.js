import fs from 'fs';
import path from 'path';
import express from 'express';
import socket_io from 'socket.io';
import http from 'http';
import morgan from 'morgan';
import debug from 'debug';
import Promise from 'bluebird';
import requestHandler from './server-express-handler';
import errorTemplate from './templates/error';
import watch from './lib/watch';
import { config } from '../package.json';
debug = debug('lumos:main');
Promise.promisifyAll(fs);

function startServer(options) {
	// options.directory
	// options.port

	var app = express();
	var server = http.createServer(app);
	var io = socket_io(server);

	app.use(morgan(':method :url :status (done after :response-time ms)'));
	app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }));
	app.use(requestHandler(options.directory));

	// development error handler
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.end(errorTemplate.render(err));
	});

	// WebSocket
	io.on('connection', socket => {
		socket.on('viewing', pathname => {
			socket.rooms.forEach(r => socket.leave(r));

			// Normalize UTF-8
			pathname = pathname.normalize();

			debug('viewing: ' + pathname);

			// Join room
			socket.join(pathname, () => {
				debug(socket.rooms, 'joined room');
			});
		});
	});

	// Watch for changes
	watch.debouncedByFilename(options.directory, (event, filename) => {
		if (!filename.endsWith(config.mdSuffix)) {
			return;
		}
		// Normalize UTF-8
		filename = filename.normalize();

		// TODO: diff content
		// Emit event
		var room = '/' + filename.slice(0, -config.mdSuffix.length);
		debug('file changed: ' + room);
		io.to(room).emit('changed');
	});

	server.listen(options.port, () => {
		debug('HTTP server started');
	});
	return server;
}

export default startServer;