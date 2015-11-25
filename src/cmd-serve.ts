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
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import MyHTML from './components/MyHTML';

interface ServerOptions {
  directory: string;
  port: number;
}

interface MyHtmlProps {
  baseDirName?: string;
  title?: string;
  breadcrumbs?: string[];
  items?: SegmentedPath[];
  dirs?: SegmentedPath[];
  content?: SegmentedPath[];
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
  app.use(handleError);

  // WebSocket
  io.on('connection', socket => {
    socket.on('viewing', pathname => {
      // Normalize UTF-8
      pathname = pathname.normalize();

      log('viewing: ' + pathname);

      socket.rooms.forEach(r => socket.leave(r));
      socket.join(pathname);
    });
  });

  // Watch for changes
  watchDebouncedByFilename(options.directory, (event, filename) => {
    filename = filename.normalize();

    // Ignore invisible files
    if (!filename.endsWith(config.mdSuffix)) {
      return;
    }

    // TODO: diff content
    // TODO: compare modification time
    // TODO: index.md

    let pathname = '/' + filename.slice(0, -config.mdSuffix.length);
    log('file changed: ' + pathname);

    // Emit event
    io.in(pathname).emit('change');
  });

  server.listen(options.port, () => {
    log('HTTP server started');
  });
  return server;
}


function render(data: MyHtmlProps) {
    return '<!DOCTYPE html>' + ReactDOMServer.renderToString(React.createElement(MyHTML, { data } ));
}

function lumosDirectory(baseDir): express.RequestHandler {
  var baseDirName = path.basename(baseDir);
  
  return function(req, res, next) {
    var processedPath = decodeURIComponent(req.path);
    
    var requestedItem = new SegmentedPath(baseDir, [ processedPath ]);
    if (!requestedItem.verifyDescendance()) {
        next(new HttpError(400, 'Bad Request'));
        return;
    }

    // Prepare data to render
    let data: MyHtmlProps = {};

    if (requestedItem.isDir)
    {
      // Read directory
      readDir(requestedItem).then(dir => {
        data.breadcrumbs = requestedItem.makeBreadcrumbs();
        data.items = dir.files;
        data.dirs = dir.dirs;
        data.title = dir.path.name === '' ? baseDirName : dir.path.name;
        if (dir.files.length > 0) {
          data.nextItem = dir.files[0];
        }
        // Include index file if available
        if (dir.hasFile(config.indexFile)) {
          dir.removeFile(config.indexFile);
          var indexPath = dir.path.makeDescendant(config.indexFile);
          return readFile(indexPath)
          .then(file => {
            data.filePath = indexPath.absolute;
            // Can't have spaces or quotes in AppleScript
            data.editURL = config.editURLProtocol + 'open/' + encodeURIComponent(indexPath.absolute).replace(/'/g, '%27');
            data.content = converter.makeHtml(file.content);
          });
        }
      }/*, err => {
        // TODO: act accordingly based on error type (ENOENT)
        throw mHTTPError(404, 'Directory Not Found');
      }*/)
      .then(() => {
        var acceptHeader = req.get('Accept');
        if (acceptHeader === 'application/json') {
          res.set({
            'Content-Type': 'application/json',
            'Vary': 'Accept'
          });
          res.json(data);
        } else {
          res.end(render(data));
        }
      })
      .catch(err => next(err));
    } else {
      requestPath.makeFile();
      var requestPathMd = requestPath.makeClone();
      requestPathMd.setLeaf(requestPathMd.getLeaf() + config.mdSuffix);
      requestPathMd.makeFile();
      data.breadcrumbs = requestPathMd.makeBreadcrumbs();

      // Read file
      readFile(requestPathMd).then(file => {
        data.title = requestPathMd.name;
        data.filePath = requestPathMd.absolute;
        // Can't have spaces or quotes in AppleScript
        data.editURL = config.editURLProtocol + 'open/' + encodeURIComponent(requestPathMd.absolute).replace(/'/g, '%27');
        data.content = converter.makeHtml(file.content);

        data.creationDate = getDateString2(file.stat.birthtime);
        data.creationTime = '';

        // Read directory
        return readDir(requestPathMd.makeParent())
        .then(dir => {
          dir.removeFile(config.indexFile);
          data.items = dir.files;
          data.dirs = dir.dirs;

          // Find active file
          var activeItem;
          for (var i = 0; i < data.items.length; ++i) {
            var item = data.items[i];
            // TODO: make this a normalized representation,
            // so that there can be no mistake between
            // folders and files
            item.isActive = item.absolute === requestPathMd.absolute;
            if (item.isActive) {
              activeItem = i;
              item.link = path.dirname(item.link);
            }
          }
          var prevItem = activeItem - 1;
          if (prevItem >= 0) {
            data.prevItem = data.items[prevItem];
          }
          var nextItem = activeItem + 1;
          if (nextItem < data.items.length) {
            data.nextItem = data.items[nextItem];
          }
        })
        .then(() => {
          var acceptHeader = req.get('Accept');
          if (acceptHeader === 'application/json') {
            res.set({
              'Content-Type': 'application/json',
              'Vary': 'Accept'
            });
            res.json(data);
          } else {
            res.end(render(data));
          }
        })
        .catch(err => next(err));
      }, err => {
        console.error(err);
        // Document not found, try to deliver the file at the original path
        res = Promise.promisifyAll(res);
        return res.sendfileAsync(requestPath.absolute);
      })
      .catch(err => {
        next(err);
        // console.error(err);
        // next(mHTTPError(404, 'File Not Found'));
      });
    }
  };
};

function readDir(dirPath) {
  var dir = new Directory(dirPath);

  return fs.statAsync(dirPath.absolute)
  .then(stat => {
    if (!stat.isDirectory()) {
      throw new Error('Is a file');
    }
    // TODO: make readContents a lazy-loading getter
    return dir.readContents();
  });
}

function readFile(filePath) {
  return fs.statAsync(filePath.absolute)
  .then(stat => {
    if (stat.isDirectory()) {
      throw new Error('Is a directory');
    }
    return fs.readFileAsync(filePath.absolute, { encoding: 'utf-8' })
    .then(content => ({ stat, content }));
  });
}

function handleError(error: HttpError, req: express.Request, res: express.Response, next: Function) {
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