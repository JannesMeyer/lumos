// ES5

var util = require('util');
var path = require('path');

/*
 * Usage:
 *
 * var debug = require('./lib/debug');
 * debug.filename = __filename;
 */

function extend(obj) {
	if (obj === undefined) {
		obj = {};
	}

	var source, prop;
	for (var i = 1, length = arguments.length; i < length; i++) {
		source = arguments[i];
		for (prop in source) {
			obj[prop] = source[prop];
		}
	}
	return obj;
}

// https://github.com/joyent/node/blob/master/lib/util.js
function stylize(str, style) {
	var color = util.inspect.colors[style];
	return '\u001b[' + color[0] + 'm' + str +
	       '\u001b[' + color[1] + 'm';
}

module.exports = exports = logger;
exports.error = error;
exports.dir = dir;

function logger(filename, options1) {
	return function(obj, options2) {
		var options = extend({ filename: filename }, options1, options2);

		if (obj instanceof Error) {
			error(obj, options);
		} else {
			dir(obj, options);
		}
	};
}

function error(err, options) {
	if (options.bell === undefined) { options.bell = true; }
	if (options.bell) {
		process.stdout.write('\x07');
	}

	var filename = err.fileName || options.filename;
	var location =  filename ? '[' + path.basename(filename) + '] ' : '';
	var message = options.showStack ? err.stack : err.message;

	console.error(stylize(location + message, 'red'));
}

function dir(obj, options) {
	if (options.colors === undefined) { options.colors = true; }

	var filename = options.filename;
	var location = filename ? '[' + path.basename(filename) + '] ' : '';

	console.log(location + util.inspect(obj, options));
}