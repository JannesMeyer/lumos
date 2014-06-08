module.exports.fn = function() {
	var gulp = require('gulp');
	var traceur = require('gulp-traceur');
	var notify = require('gulp-notify');
	// var changed = require('gulp-changed');
	var config = require('./gulpconfig.json');

	gulp.src(config.src.serverJS)
		.pipe(traceur({ sourceMap: true }))
		.on('error', notify.onError(config.errorTemplate))
		.pipe(gulp.dest(config.dest.serverJS));
};