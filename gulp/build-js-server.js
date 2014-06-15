exports.fn = function() {
	var gulp = require('gulp');
	var plumber = require('gulp-plumber');
	var traceur = require('gulp-traceur');
	// var changed = require('gulp-changed');
	var notify = require('gulp-notify');
	var config = require('./gulp.config.json');

	return gulp.src(config.src.serverJS)
		.pipe(plumber({ errorHandler: notify.onError(config.errorTemplate) }))
		.pipe(traceur())
		.pipe(gulp.dest(config.dest.serverJS));
};