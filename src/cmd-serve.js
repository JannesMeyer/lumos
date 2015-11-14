import minimist from 'minimist';
import { config } from '../package.json';
import fs from 'fs';
import path from 'path';
import express from 'express';
import socket_io from 'socket.io';
import http from 'http';
import morgan from 'morgan';
import debugLib from 'debug';
import Promise from 'bluebird';
import requestHandler from './server-express-handler';
import * as errorTemplate from './templates/error';
import * as watch from './lib/watch';
var debug = debugLib('lumos:main');
Promise.promisifyAll(fs);

export default function cmd(args) {
	var argv = minimist(args);

	var options = {
		directory: process.cwd(),
		port: argv.port || config.defaultPort
	};
	startServer(options);
}


function startServer(options) {
  // options.directory
  // options.port

  var app = express();
  var server = http.createServer(app);
  var io = socket_io(server, { path: '/581209544f9a07/socket.io' });

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
      // Normalize UTF-8
      pathname = pathname.normalize();

      debug('viewing: ' + pathname);

      socket.rooms.forEach(r => socket.leave(r));
      socket.join(pathname);
    });
  });

  // Watch for changes
  watch.debouncedByFilename(options.directory, (event, filename) => {
    filename = filename.normalize();

    // Ignore invisible files
    if (!filename.endsWith(config.mdSuffix)) {
      return;
    }

    // TODO: diff content
    // TODO: compare modification time
    // TODO: index.md

    var pathname = '/' + filename.slice(0, -config.mdSuffix.length);
    debug('file changed: ' + pathname);

    // Emit event
    io.in(pathname).emit('change');
  });

  server.listen(options.port, () => {
    debug('HTTP server started');
  });
  return server;
}