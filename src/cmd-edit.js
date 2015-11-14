import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import Promise from 'bluebird';
import childProcess from 'child_process';
import dateTool from './lib/date-tool';
import { config } from '../package.json';
Promise.promisifyAll(fs);

function isDefined(value) {
  return value !== undefined;
}

function editor(files) {
  if (files === undefined) {
    files = [];
  }
  // console.log(config.editorArgs.concat(files));
  childProcess.spawn(config.editor, config.editorArgs.concat(files), { stdio: 'inherit' });
}

function createFiles(files) {
  // TODO: create recursively
  // https://www.npmjs.org/package/mkdirp

  return Promise.all(files.map(f => {
      var dir = path.dirname(f);

      return fs.statAsync(dir)
      .then(stat => {
        if (stat.isFile()) {
          throw new Error('Found a file instead of a directory');
        }
      }, err => {
        // TODO: Does fs.statAsync throw if the directory doesn't exist?
        return fs.mkdirAsync(dir);
      });
    }
  ));
}

// Needs an absolute path
export default function cmd(args) {
  var argv = minimist(args);
  if (argv._.length === 0) {
    throw new Error('Need more arguments');
  }

  if (argv['decode-uri-component']) {
    // escape() will not encode: @*/+
    // (encodes Unicode characters to Unicode escape sequences, too)
    // encodeURI() will not encode: ~!@#$&*()=:/,;?+'
    // encodeURIComponent() will not encode: ~!*()'
    argv._ = argv._.map((file, i) => {
      return decodeURIComponent(file);
    });
  }
  // Open the files in an editor
  createFiles(argv._)
  .then(() => {
    // TODO: respect errors
    editor(argv._);
  });
}
