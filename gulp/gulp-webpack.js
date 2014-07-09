var through = require('through2');
var webpack = require('webpack');
var path = require('path');

// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
// https://github.com/webpack/webpack/blob/master/lib/Stats.js
// console.log(stats.toString({ colors: true }));

module.exports = function(webpackConfig) {
	return through.obj(function(file, enc, callback) {
		// side-effect
		var _this = this;
		webpack(webpackConfig, function(err, stats) {
			if (err) {
				cerr.error.plugin = 'webpack';
				_this.emit('error', err);
				return callback();
			}
			stats.compilation.errors.forEach(function(cerr) {
				cerr.error.plugin = 'webpack';
				cerr.error.filename = path.basename(cerr.module.userRequest);
				_this.emit('error', cerr.error);
			});
			return callback();
		});
	});
}