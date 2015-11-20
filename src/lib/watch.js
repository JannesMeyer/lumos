import fs from 'fs';
import iconv from 'iconv-lite';
import { debounce } from 'date-tool';

function fixEncoding(callback) {
  return function() {
    if (arguments[1] !== undefined) {
      arguments[1] = iconv.decode(iconv.encode(arguments[1], 'iso-8859-1'), 'utf-8');
    }
    callback.apply(undefined, arguments);
  };
}

export function debounced(dir, changeHandler) {
  fs.watch(dir, { recursive: true }, debounce(changeHandler, 50));
}

export function debouncedByFilename(dir, changeHandler) {
  if (process.platform === 'darwin') {
    // Account for that weird node.js bug with FSEvents on OSX
    // TODO: Remove when node.js is fixed
    changeHandler = fixEncoding(changeHandler);
  }

  // Group events based on filename (1)
  fs.watch(dir, { recursive: true }, debounce(changeHandler, 50, 1));
}