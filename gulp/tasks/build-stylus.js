exports.fn = function() {
	var gulp = require('gulp');
	var plumber = require('gulp-plumber');
	var stylus = require('gulp-stylus');
	var autoprefixer = require('gulp-autoprefixer');
	// var rename = require('gulp-rename');
	// var minifycss = require('gulp-minify-css');
	var config = require('../gulp.config');
	var debug = require('../../src/lib/debug')('stylus');

	return gulp.src(config.src.styles)
		.pipe(plumber({ errorHandler: debug }))
		.pipe(stylus())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest(config.dest.styles));
		// .pipe(rename({ suffix: '.min' }))
		// .pipe(minifycss())
		// .pipe(gulp.dest(config.dest.styles));
};