var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var jstransform = require('jstransform');
var visitors = require('../mytransform').visitorList;

var PLUGIN_NAME = 'gulp-jstransfrom';

module.exports = function() {
	return through.obj(function(file, encoding, callback) {
		if (file.isNull()) {
			this.push(file); // pass along
		} else if (file.isStream()) {
			throw new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported');
		} else if (file.isBuffer()) {
			try {
				var es5 = jstransform.transform(visitors, file.contents.toString());
			} catch(err) {
				err.plugin = file.relative;
				this.emit('error', err);
				return callback();
			}

			file.contents = new Buffer(es5.code);
			file.path = gutil.replaceExtension(file.path, '.js');
			this.push(file);
		}

		callback();
	});
};