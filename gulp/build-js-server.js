exports.fn = function(callback) {
	var webpack = require("webpack");
	var path = require('path');

	webpack({
	    entry: "./bin/lumos",
	    target: "node",
	    output: {

	        path: path.join(__dirname, 'assets'),
	        filename: '../bin/lumos.generated.js',
	        libraryTarget: 'commonjs'
	    },
	    externals: [
	    	/^([a-z\-\.0-9]+)$/,
	    	/.json$/
    	],
		module: {
	        loaders: [
				{ test: /\.jsx$/, loader:  'es6?jsx' },
				{ test: /\.js$/, loader: 'es6', exclude: [ path.join(__dirname, '..', 'node_modules') ] }
	        ]
		},
		resolve: {
		    extensions: ['', '.js'],
		    modulesDirectories: ['src', 'node_modules']
		}
	}, function(err, stats) {
        if(err) {
			console.error(err);
			throw err;
        }

    	console.error(stats.toString({ colors: true }));

	    callback();
	});
};

// exports.fn = function() {
// 	var gulp = require('gulp');
// 	var plumber = require('gulp-plumber');
// 	var traceur = require('gulp-traceur');
// 	// var changed = require('gulp-changed');
// 	var notify = require('gulp-notify');
// 	var config = require('./gulp.config.json');

// 	return gulp.src(config.src.serverJS)
// 		.pipe(plumber({ errorHandler: notify.onError(config.errorTemplate) }))
// 		.pipe(traceur())
// 		.pipe(gulp.dest(config.dest.serverJS));
// };