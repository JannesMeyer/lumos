var path = require('path');

exports.name = function(filename) {
	var basename = path.basename(filename);
	return path.basename(basename, path.extname(basename));
};