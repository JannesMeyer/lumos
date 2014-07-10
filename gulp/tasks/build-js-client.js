// Example:
// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js

// TODO: NODE_ENV=production

exports.fn = function(callback) {
	var path = require('path');
	var webpack = require('webpack');
	var webpackConfig = require('../webpack.config');
	var debug = require('../../src/lib/debug');
	debug.filename = __filename;

	webpack(webpackConfig, function(err, stats) {
		if (err) {
			debug(err);
			return callback();
		}

		// https://github.com/webpack/webpack/blob/master/lib/Stats.js
		stats.compilation.errors.forEach(function(cerr) {
			cerr.error.fileName = cerr.module.userRequest;
			debug(cerr.error);
		});

		// console.log(stats.toString({ colors: true }));

		return callback();
	});
};