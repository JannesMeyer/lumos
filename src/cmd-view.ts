import * as minimist from 'minimist';
import { spawn } from 'child_process';
import config from './config';

export default function cmd(args) {
  var argv = minimist(args);

  if (argv._.length === 0) {
    throw new Error('Not enough arguments');
  }

  var pathname;
  // convert to pathname
  if (argv['base-path']) {
    var basePath = argv['base-path'];
    var absPath = argv._[0];

    if (absPath.startsWith(basePath)) {
      var baseStripped = absPath.substring(basePath.length);
      pathname = (baseStripped.startsWith('/') ? '' : '/') + baseStripped;
    } else {
      throw new Error('The provided path does not start with <base-path>');
    }
  } else {
    pathname = '/' + argv._[0];
  }

  // Strip "(index).md" from the end
  if (pathname.endsWith(config.indexFile)) {
    pathname = pathname.slice(0, -config.indexFile.length);
  } else if (pathname.endsWith(config.mdSuffix)) {
    pathname = pathname.slice(0, -config.mdSuffix.length);
  }

  // Open URL in browser
  var baseUrl = 'http://notes';
  var url = baseUrl + pathname;
  console.log('Opening...', url);
  // TODO: make this cross-platform, but without exec()
  // https://www.npmjs.org/package/open
  spawn('open', [url], { stdio: 'inherit' });
}