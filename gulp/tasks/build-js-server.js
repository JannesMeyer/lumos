// TODO: use gulp-changed

exports.fn = function() {
	var gulp = require('gulp');
	var plumber = require('gulp-plumber');
	var notify = require('gulp-notify');
	var jstransform = require('../gulp-jstransform');
	// var uglify = require('gulp-uglify');
	// var streamify = require('gulp-streamify');
	// var rename = require('gulp-rename');
	var config = require('../gulp.config');

	return gulp.src(config.src.javascripts)
		.pipe(plumber({ errorHandler: notify.onError(config.errorTemplate) }))
		.pipe(jstransform())
		.pipe(gulp.dest(config.dest.javascripts));
		// .pipe(rename({ suffix: '.min' }))
		// .pipe(streamify(uglify()))
		// .pipe(gulp.dest(config.dest.clientJS));
};