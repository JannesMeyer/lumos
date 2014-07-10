exports.dep = ['build', 'node'];
exports.fn = function() {
	var gulp = require('gulp');
	var watch = require('../../dist/lib/watch');
	var config = require('../gulp.config');

	watch(config.watch.styles, function() {
		gulp.start('build-stylus');
	});
	watch(config.watch.javascripts, function() {
		gulp.start('build-js-client', 'node');
	});
};