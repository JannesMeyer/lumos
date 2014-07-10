exports.fn = function() {
	var gulp = require('gulp');
	var stylus = require('gulp-stylus');
	var plumber = require('gulp-plumber');
	var notify = require('gulp-notify');
	var autoprefixer = require('gulp-autoprefixer');
	// var rename = require('gulp-rename');
	// var minifycss = require('gulp-minify-css');
	var config = require('../gulp.config');

	return gulp.src(config.src.styles)
		.pipe(plumber({ errorHandler: notify.onError(config.errorTemplate) }))
		.pipe(stylus())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest(config.dest.styles));
		// .pipe(rename({ suffix: '.min' }))
		// .pipe(minifycss())
		// .pipe(gulp.dest(config.dest.styles));
};