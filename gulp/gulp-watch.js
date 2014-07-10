var fs = require('fs');
var debounce = require('../dist/lib/debounce');

function watch(dir, changeHandler) {
	fs.watch(dir, { recursive: true }, debounce(changeHandler, 100));
}

module.exports = watch;