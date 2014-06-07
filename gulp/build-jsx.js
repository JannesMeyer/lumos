module.exports.fn = function() {
	var gulp = require('gulp');
	var react = require('gulp-react');
	var traceur = require('gulp-traceur');
	var paths = require('./paths.json');

	gulp.src(paths.src.components)
		.pipe(react({ harmony: true }))
		.pipe(traceur())
		.pipe(gulp.dest(paths.dest.components));
};