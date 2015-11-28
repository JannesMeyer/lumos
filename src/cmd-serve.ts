import * as minimist from 'minimist';
import config from './config';
import * as fs from 'fs';
import * as async from 'async';
import * as path from 'path';
import * as express from 'express';
import * as socket_io from 'socket.io';
import * as http from 'http';
import * as morgan from 'morgan';
import * as debug from 'debug';
import { watchDebouncedByFilename } from './lib/file-watcher';

import * as converter from './lib/converter-marked';
import { getDateString2 } from 'date-tool';
import { SegmentedPath } from './classes/SegmentedPath';
import { Directory } from './classes/Directory';
import { render } from './components/MyHTML';

interface ServerOptions {
  directory: string;
  port: number;
}

class HttpError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

var log = debug('lumos:main');

export default function cmd(args) {
  let argv = minimist(args);
  
  startServer({
    directory: argv['dir']  || config.directory,
    port:      argv['port'] || config.port
  });
}

/**
 * Start a server
 */
export function startServer(options: ServerOptions) {
  // Creat express app
  let app = express();
  let server = http.createServer(app);
  let io = socket_io(server, { path: '/581209544f9a07/socket.io' });

  app.use(morgan(':method :url :status (done after :response-time ms)'));
  app.use(express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 }));
  app.use(lumosDirectory(options.directory));
  
  // development error handler
  // TODO: if (__DEV__)
  app.use(showError);

  // // WebSocket
  // io.on('connection', socket => {
  //   socket.on('viewing', pathname => {
  //     // Normalize UTF-8
  //     pathname = pathname.normalize();

  //     log('viewing: ' + pathname);

  //     socket.rooms.forEach(r => socket.leave(r));
  //     socket.join(pathname);
  //   });
  // });

  // // Watch for changes
  // watchDebouncedByFilename(options.directory, (event, filename) => {
  //   filename = filename.normalize();

  //   // Ignore invisible files
  //   if (!filename.endsWith(config.mdSuffix)) {
  //     return;
  //   }

  //   // TODO: diff content
  //   // TODO: compare modification time
  //   // TODO: index.md

  //   let pathname = '/' + filename.slice(0, -config.mdSuffix.length);
  //   log('file changed: ' + pathname);

  //   // Emit event
  //   io.in(pathname).emit('change');
  // });

  server.listen(options.port, () => {
    log('HTTP server started');
  });
  return server;
}

function lumosDirectory(basePath): express.RequestHandler {
  let base = new Directory(basePath);
  
  return function showPage(req, res, next) {
    let urlPath = decodeURIComponent(req.path);
    
    // TODO: normalize and redirect
    // TODO: error if it tries to break out of sandbox
    // TODO: cache by normalized urlPath. Implicitly build the whole tree!
    
    if (urlPath.endsWith('/')) {
      let directory = new Directory(urlPath, base);
      // TODO: prepare data (index.md, other files in container)
      // TODO: get a fs.stat()
    } else {
      let file = new File(urlPath, base);
      // TODO: getParent()
      // TODO: prepare data (content, other files in container)
      // TODO: get a fs.stat()
    }
  };
}

function showError(error: HttpError, req: express.Request, res: express.Response, next: Function) {
  res.status(error.code).end(`<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<h1>${error.code} ${error.message}</h1>
<pre>${error.stack}</pre>
</body>
</html>`);
}