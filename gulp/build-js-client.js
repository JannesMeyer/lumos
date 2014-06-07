module.exports.fn = function() {
	var gulp = require('gulp');
	var browserify = require('browserify');
	var sourceStream = require('vinyl-source-stream');
	// var uglify = require('gulp-uglify');
	// var streamify = require('gulp-streamify');
	// var rename = require('gulp-rename');
	var paths = require('./paths.json');

	browserify(paths.src.clientJS)
	    .bundle()
	    .pipe(sourceStream('client.js'))
	    .pipe(gulp.dest(paths.dest.clientJS));
	    // .pipe(rename({ suffix: '.min' }))
	    // .pipe(streamify(uglify()))
	    // .pipe(gulp.dest(paths.dest.clientJS));
};