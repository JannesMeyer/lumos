module.exports.fn = function() {
	var gulp = require('gulp');
	var plumber = require('gulp-plumber');
	var notify = require('gulp-notify');
	var react = require('gulp-react');
	var traceur = require('gulp-traceur');
	var config = require('./gulpconfig.json');

	return gulp.src(config.src.components)
		.pipe(plumber({ errorHandler: notify.onError(config.errorTemplate) }))
		.pipe(react({ harmony: true }))
		.pipe(traceur())
		.pipe(gulp.dest(config.dest.components));
};