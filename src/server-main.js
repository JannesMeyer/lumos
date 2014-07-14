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
		// TODO: debounce based on filename
		// TODO: diff content

		// TODO: the filename for some utf8 files seems to be incorrect
		// when reported through the fs.watch API
		debug('File event: ' + filename);
		// fs.statAsync(filename)
		// .then(stats => {
		// 	console.log('file exists');
		// })
		// .catch(Promise.OperationalError, err => {
		// 	console.log('file not found');
		// });

		// Emit event
		var room = '/' + filename.slice(0, -config.mdSuffix.length);
		console.log('room', room);
		io.to(room).emit('changed');
	});

	server.listen(options.port, () => {
		debug('HTTP server started');
	});
	return server;
}

export default startServer;