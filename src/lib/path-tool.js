var path = require('path');

export function name(filename) {
	var basename = path.basename(filename);
	return path.basename(basename, path.extname(basename));
};