import fs from 'fs';
import debounce from './debounce';
import debug from 'debug';
debug = debug('lumos:watcher');

function watch(dir, changeHandler) {
	var changeHandler = debounce(changeHandler, 100);
	fs.watch(dir, { recursive: true }, function(event, filename) {
		debug('%s: %s', event, filename);
		changeHandler(event, filename);
	});
}

export default watch;