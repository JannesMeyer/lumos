import fs from 'fs';
import path from 'path';
import express from 'express';
import socket_io from 'socket.io';
import http from 'http';
import morgan from 'morgan';
import requestHandler from './server-express-handler';
import errorTemplate from './templates/error';
// import Promise from 'bluebird';
import { config } from '../package.json';
import debug from 'debug';
debug = debug('lumos:sockets');

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
		// socket = Promise.promisifyAll(socket);

		// debug(Object.keys(io.sockets.connected));

		// socket.on('disconnect', () => {
		// 	debug(Object.keys(io.sockets.connected));
		// });

		socket.on('viewing', pathname => {
			socket.rooms.forEach(r => socket.leave(r));
			socket.join(pathname, () => {
				debug(socket.rooms, 'joined room');
			});

			fs.watch(options.directory, { recursive: true }, (event, filename) => {
				if (!filename.endsWith(config.mdSuffix)) {
					return;
				}
				// TODO: debounce based on filename
				// TODO: diff content
				debug('%s: %s', event, filename);
				var room = encodeURI('/' + filename.slice(0, -config.mdSuffix.length));
				io.to(room).emit('changed');
			});
		});
	});

	server.listen(options.port, () => {
		debug('HTTP server started');
	});
	return server;
}

export default startServer;