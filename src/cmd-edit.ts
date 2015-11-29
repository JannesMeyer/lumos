import * as path from 'path';
import * as minimist from 'minimist';
import * as childProcess from 'child_process';
import config from './config';

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

      // return fs.stat(dir).then(stat => {
      //   if (stat.node.isFile()) {
      //     throw new Error('Found a file instead of a directory');
      //   }
      // }, err => {
      //   // TODO: Does fs.statAsync throw if the directory doesn't exist?
      //   return fs.makeDirectory(dir);
      // });
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
