import * as path from 'path';
import * as childProcess from 'child_process';
import { parseIsoDateString, getShortMonthName } from 'date-tool';
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

export default function cmd(args) {
  // Read dates from command line
  var days = (args.length > 0 ? args.map(parseIsoDateString) : [ new Date() ]);

  // Convert to paths
  var files = days.map(date => path.join(
    config.diaryBaseDir,
    String(date.getFullYear()),
    String(date.getMonth() + 1),
    getShortMonthName(date) + ' ' + date.getDate() + config.mdSuffix
  ));

  // Open the files in an editor
  createFiles(files).then(() => {
    // TODO: respect errors
    editor(files);
  });
}