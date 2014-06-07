module.exports.fn = function() {
	var gulp = require('gulp');
	var traceur = require('gulp-traceur');
	// var changed = require('gulp-changed');
	var paths = require('./paths.json');

	gulp.src(paths.src.serverJS)
		.pipe(traceur({ sourceMap: true }))
		.pipe(gulp.dest(paths.dest.serverJS));
};