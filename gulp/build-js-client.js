exports.fn = function(callback) {
	var gulp = require('gulp');
	var gutil = require('gulp-util');
	var plumber = require('gulp-plumber');
	var notify = require('gulp-notify');
	var webpack = require('./gulp-webpack');
	var config = require('./gulp.config');
	var webpackConfig = require('./webpack.config');

	return gulp.src(config.webpack.entry) // not used
		.pipe(plumber({ errorHandler: notify.onError(config.errorTemplate) }))
	    .pipe(webpack(webpackConfig))
	    .pipe(gutil.noop());
};
