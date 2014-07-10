exports.fn = function(callback) {
	var path = require('path');
	// TODO: is this okay on the first compile?
	var debug = require('../../dist/lib/debug');
	debug.filename = __filename;
	var config = require('../gulp.config');
	var webpack = require('webpack');
	var webpackConfig = require('../webpack.config');

	// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
	// https://github.com/webpack/webpack/blob/master/lib/Stats.js
	// console.log(stats.toString({ colors: true }));

	webpack(webpackConfig, function(err, stats) {
		if (err) {
			debug(err);
			return callback();
		}

		stats.compilation.errors.forEach(function(cerr) {
			cerr.error.fileName = cerr.module.userRequest;
			debug(cerr.error);
		});
		return callback();
	});
};