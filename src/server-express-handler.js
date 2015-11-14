import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import * as converter from './lib/converter-marked';
import * as dateTool from './lib/date-tool';
import { config } from '../package.json';
import { SegmentedPath } from './classes/SegmentedPath';
import { Directory } from './classes/Directory';

import React from 'react';
import MyHTML from './components/MyHTML';
import { get } from './client-lib/data-source';

Promise.promisifyAll(fs);

function render(data) {
  return '<!DOCTYPE html>' + React.renderToString(<MyHTML data={data} />);
}

export default function handleRequest(baseDir) {
  var baseDirName = path.basename(baseDir);

  return function(req, res, next) {
    var processedPath = decodeURIComponent(req.path);
    var requestPath = new SegmentedPath(baseDir, [processedPath]);
    if (!requestPath.verifyDescendance()) {
        next(mMakeError(400, 'Bad Request'));
        return;
    }

    // Prepare data to render
    var data = {
      baseDirName: baseDirName
      // title
      // breadcrumbs
      // items
      // content
    };

    if (requestPath.isDir)
    {
      // Read directory
      return readDir(requestPath)
      .then(dir => {
        data.breadcrumbs = requestPath.makeBreadcrumbs();
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
      return readFile(requestPathMd)
      .then(file => {
        data.title = requestPathMd.name;
        data.filePath = requestPathMd.absolute;
        // Can't have spaces or quotes in AppleScript
        data.editURL = config.editURLProtocol + 'open/' + encodeURIComponent(requestPathMd.absolute).replace(/'/g, '%27');
        data.content = converter.makeHtml(file.content);

        var creationDate = dateTool.createFromDate(file.stat.birthtime);
        data.creationDate = dateTool.toString(creationDate);
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

/**
 * Shorthand to create an Error object with a status code
 */
function mHTTPError(status, message) {
  var error = new Error(message);
  error.status = status;
  return error;
}