module.exports.fn = function() {
	var gulp = require('gulp');
	var stylus = require('gulp-stylus');
	var notify = require('gulp-notify');
	var autoprefixer = require('gulp-autoprefixer');
	var minifycss = require('gulp-minify-css');
	var rename = require('gulp-rename');
	var config = require('./gulpconfig.json');

	return gulp.src(config.src.styles)
		.pipe(stylus())
		.on('error', notify.onError(config.errorTemplate))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest(config.dest.styles));
		// .pipe(rename({ suffix: '.min' }))
		// .pipe(minifycss())
		// .pipe(gulp.dest(config.dest.styles));
};