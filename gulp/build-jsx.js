exports.fn = function(callback) {
	var path = require('path');
	var gutil = require('gulp-util');
	var webpack = require('webpack');
	var notifier = new require('node-notifier')();

	// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
	var webpackConfig = {
		cache: true,
		entry: './src/components/page.jsx',
		output: {
		    path: './public/javascripts/',
		    filename: '[name].bundle.js'
		},
		module: {
	        loaders: [
				{ test: /\.jsx$/, loader: __dirname + '/../transform/es6-loader.js?jsx' },
				{ test: /\.js$/, loader: __dirname + '/../transform/es6-loader.js' }
	        ]
		},
		resolve: {
		    extensions: ['', '.js'],
		    modulesDirectories: ['src', 'node_modules']
		}
	};

    webpack(webpackConfig, function(err, stats) {
        if(err) {
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