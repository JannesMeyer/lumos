import util from 'util';
import path from 'path';

/*
	Usage:

	var debug = require('./lib/debug');
	debug.filename = __filename;
	debug.stack = true;
 */

// https://github.com/joyent/node/blob/master/lib/util.js
function stylize(str, style) {
	var color = util.inspect.colors[style];
	return '\u001b[' + color[0] + 'm' + str +
	       '\u001b[' + color[1] + 'm';
}

module.exports = exports = function log(obj, options) {
	if (obj instanceof Error) {
		error(obj, options);
	} else {
		dir(obj, options);
	}
}

function error(err, options) {
	var filename = err.fileName || exports.filename;
	var location =  filename ? '[' + path.basename(filename) + '] ' : '';
	var message = exports.stack ? err.stack : err.name + ': ' + err.message;
	console.error(stylize(location + message, 'red'));
}
exports.error = error;

function dir(obj, options) {
	if (options === undefined) { options = {}; }
	if (options.colors === undefined) { options.colors = true; }

	var location = exports.filename ? '[' + path.basename(exports.filename) + '] ' : '';
	console.log(location + util.inspect(obj, options));
}
exports.dir = dir;