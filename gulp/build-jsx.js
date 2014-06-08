module.exports.fn = function() {
	var gulp = require('gulp');
	var react = require('gulp-react');
	var traceur = require('gulp-traceur');
	var config = require('./gulpconfig.json');

	gulp.src(config.src.components)
		.pipe(react({ harmony: true }))
		.pipe(traceur())
		.pipe(gulp.dest(config.dest.components));
};