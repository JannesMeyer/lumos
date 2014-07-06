var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var jstransform = require('jstransform');
var visitors = require('../mytransform').visitorList;

module.exports = function(options) {
	return through.obj(function(file, encoding, callback) {
		if (file.isNull()) {
			this.push(file); // pass along
			return callback();
		}
		if (file.isStream()) {
			this.emit('error', new Error('gulp-jstransfrom: Streaming not supported'));
			return callback();
		}

		var es5;
		var str = file.contents.toString();

		try {
			es5 = jstransform.transform(visitors, str);
		} catch(err) {
			err.plugin = file.relative;
			this.emit('error', err);
			return callback();
		}

		file.contents = new Buffer(es5.code);
		file.path = gutil.replaceExtension(file.path, '.js');
		this.push(file);
		callback();
	});
};