exports.dep = ['build-all', 'node', 'livereload'];
exports.fn = function() {
	var gulp = require('gulp');
	var config = require('./gulp.config.json');

	gulp.watch(config.watch.styles, ['build-stylus']);
	gulp.watch(config.src.javascripts, ['build-js-server', 'build-js-client', 'node']);
};