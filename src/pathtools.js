var path = require('path');

module.exports.name = function(filename) {
	var basename = path.basename(filename);
	return path.basename(basename, path.extname(basename));
};

// asd