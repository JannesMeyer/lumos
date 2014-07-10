// Example:
// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js

// TODO: NODE_ENV=production

exports.fn = function(callback) {
	var path = require('path');
	var webpack = require('webpack');
	var webpackConfig = require('../webpack.config');
	var debug = require('../../src/lib/debug');

	webpack(webpackConfig, function(err, stats) {
		if (err) {
			debug(err);
			return callback();
		}

		// https://github.com/webpack/webpack/blob/master/lib/Stats.js
		stats.compilation.errors.forEach(function(cmplError) {
			cmplError.error.fileName = cmplError.module.userRequest;
			debug(cmplError.error);
		});

		// Log debug output
		// console.log(stats.toString({ colors: true }));

		return callback();
	});
};