var fs = require('fs');
var gulp = require('gulp');
var debounce = require('../dist/lib/debounce');

function watch(dir, tasks) {
	var changeHandler = debounce(function(event) {
		gulp.start.apply(gulp, tasks);
	}, 100);

	fs.watch(dir, { recursive: true }, changeHandler);
}

module.exports = watch;