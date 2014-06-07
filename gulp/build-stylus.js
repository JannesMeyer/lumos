module.exports.fn = function() {
	var gulp = require('gulp');
	var stylus = require('gulp-stylus');
	var autoprefixer = require('gulp-autoprefixer');
	var minifycss = require('gulp-minify-css');
	var rename = require('gulp-rename');
	var paths = require('./paths.json');

	gulp.src(paths.src.styles)
		.pipe(stylus({ errors: true }))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest(paths.dest.styles))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest(paths.dest.styles));
};