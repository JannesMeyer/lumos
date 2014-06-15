exports.dep = ['build', 'node', 'livereload'];
exports.fn = function() {
	var gulp = require('gulp');
	var config = require('./gulp.config.json');

	gulp.watch(config.watch.styles, ['build-stylus']);
	gulp.watch(config.src.serverJS, ['node']);
	gulp.watch(config.src.components, ['build-jsx']);
};