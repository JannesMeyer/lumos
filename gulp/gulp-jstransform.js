var gutil = require('gulp-util');
var through = require('through2');
var jstransform = require('jstransform');
var visitors = require('../mytransform').visitorList;

module.exports = function() {
	return through.obj(function(file, encoding, callback) {
		if (file.isNull()) {
			// pass along
		} else if (file.isStream()) {
			throw new gutil.PluginError('gulp-jstransfrom', 'Streaming not supported');
		} else if (file.isBuffer()) {
			try {
				var es5 = jstransform.transform(visitors, file.contents.toString());
			} catch(err) {
				err.plugin = 'jstransfrom';
				err.filename = file.relative;
				this.emit('error', err);
				return callback();
			}

			file.contents = new Buffer(es5.code);
			file.path = gutil.replaceExtension(file.path, '.js');
		}

		this.push(file);
		callback();
	});
};