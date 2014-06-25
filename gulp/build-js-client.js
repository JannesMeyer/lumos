exports.fn = function(callback) {
	var path = require('path');
	var gutil = require('gulp-util');
	var webpack = require('webpack');
	var notifier = new require('node-notifier')();
	var config = require('./gulp.config.json');

	function getDir(dir) {
		return path.join(__dirname, '..', dir);
	}

	var webpackConfig = {
		cache: true,
		entry: config.webpack.entry,
		output: config.webpack.output,
		module: {
	        loaders: [
				{ test: /\.jsx$/, loader:  'es6-loader' },
				{ test: /\.js$/, loader: 'es6-loader', exclude: [ getDir('node_modules') ] }
	        ]
		},
		resolve: {
		    root: getDir('src'),
		    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
		}
	}

	// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js

    webpack(webpackConfig, function(err, stats) {
        if(err) {
			console.error(err);
			throw err;
        }

	    // Show notification
	    // https://github.com/webpack/docs/wiki/node.js-api
	    // https://github.com/webpack/webpack/blob/master/lib/Stats.js
        // stats.compilation.errors.forEach(function(err) {
        // 	notifier.notify({
        // 		title: path.basename(err.module.userRequest),
        // 		message: err.error.message
        // 	});
        // });

    	// TODO: configuration error instead of compilation error

        // Log error
    	console.error(stats.toString({ colors: true }));

        callback();
    });
};