exports.fn = function() {
	var gulp = require('gulp');
	var plumber = require('gulp-plumber');
	var notify = require('gulp-notify');
	var jstransform = require('./gulp-jstransform');
	var config = require('./gulp.config.json');

	return gulp.src(config.src.serverJS)
		.pipe(plumber({ errorHandler: notify.onError(config.errorTemplate) }))
		.pipe(jstransform())
		.pipe(gulp.dest(config.dest.serverJS));
};

// exports.fn = function(callback) {
// 	var webpack = require("webpack");
// 	var path = require('path');

// 	webpack({
// 		cache: true,
// 	    target: 'node',
// 	    entry: {
// 	    	app: './src/app',
// 	    	open: './src/open'
// 	    },
// 	    output: {
// 	        path: 'dist',
// 	        filename: '[name].js',
// 	        libraryTarget: 'commonjs2'
// 	    },
// 	    externals: [
// 	    	/^([a-z\-\.0-9]+)$/,
// 	    	/\.json$/
//     	],
// 		module: {
// 	        loaders: [
// 				{ test: /\.jsx$/, loader:  'es6?jsx' },
// 				{ test: /\.js$/, loader: 'es6' }
// 	        ]
// 		},
// 		resolve: {
// 		    extensions: ['', '.js'],
// 		    modulesDirectories: ['src', 'node_modules']
// 		}
// 	}, function(err, stats) {
//         if(err) {
// 			console.error(err);
// 			throw err;
//         }

//     	console.error(stats.toString({ colors: true }));

// 	    callback();
// 	});
// };