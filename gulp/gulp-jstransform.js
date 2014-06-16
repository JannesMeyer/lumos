var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var jstransform = require('jstransform');
var visitors = require('../mytransform').visitorList;

function replaceExtension(filePath, newExtension) {
	var extension = path.extname(filePath);
	if (extension === newExtension) {
		return filePath;
	}
	var newFileName = path.basename(filePath, extension) + newExtension;
	return path.join(path.dirname(filePath), newFileName);
}

module.exports = function(options) {
	return through.obj(function(file, encoding, callback) {
		if (file.isStream()) {
			return callback(new gutil.PluginError('gulp-jstransfrom: Streaming not supported'));
		}
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		var es5 = jstransform.transform(visitors, file.contents.toString());

		file.path = replaceExtension(file.path, '.js');
		file.contents = new Buffer(es5.code);
		this.push(file);
		callback();
	});
};