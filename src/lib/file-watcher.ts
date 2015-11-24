import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import * as debug from 'debug';
import { debounce } from 'date-tool';

var log = debug('lumos:watcher');

export function watchDebounced(directory, eventHandler) {
  log(`Setting up file watching for '${directory}'`);

  fs.watch(directory, { recursive: true }, debounce(eventHandler, 50));
}

export function watchDebouncedByFilename(directory, eventHandler) {
  log(`Setting up file watching for '${directory}'`);

  let callback = eventHandler;

  // Handle Node.js + FSEvents bug
  if (process.platform === 'darwin') {
    callback = function(event, filename) {
      if (filename != null) {
        arguments[1] = iconv.decode(iconv.encode(filename, 'iso-8859-1'), 'utf-8');
      }
      eventHandler.apply(null, arguments);
    };
  }

  // Group events based on filename (2nd argument)
  fs.watch(directory, { recursive: true }, debounce(callback, 50, 1));
}