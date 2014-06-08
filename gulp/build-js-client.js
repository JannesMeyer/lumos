module.exports.dep = ['build-js-server'];
module.exports.fn = function() {
	var gulp = require('gulp');
	var notify = require('gulp-notify');
	var browserify = require('browserify');
	var sourceStream = require('vinyl-source-stream');
	// var uglify = require('gulp-uglify');
	// var streamify = require('gulp-streamify');
	// var rename = require('gulp-rename');
	var config = require('./gulpconfig.json');

	return browserify(config.src.clientJS)
		.bundle()
		.on('error', notify.onError(config.errorTemplate))
		.pipe(sourceStream('client.js'))
		.pipe(gulp.dest(config.dest.clientJS));
		// .pipe(rename({ suffix: '.min' }))
		// .pipe(streamify(uglify()))
		// .pipe(gulp.dest(config.dest.clientJS));
};