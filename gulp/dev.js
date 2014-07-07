exports.dep = ['build-all', 'serve'];
exports.fn = function() {
	var fs = require('fs');
	var gulp = require('gulp');
	var config = require('./gulp.config.json');
	var debounce = require('../dist/lib/debounce');

	function watch(dir, tasks) {
		fs.watch(dir, debounce(function(event) {
			gulp.start.apply(gulp, tasks);
		}, 50));
	}

	watch(config.watch.styles, ['build-stylus']);
	watch(config.watch.javascripts, ['build-js-client', 'serve']);
};