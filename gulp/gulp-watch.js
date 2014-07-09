var fs = require('fs');
var gulp = require('gulp');
var debounce = require('../dist/lib/debounce');

function watch(dir, tasks) {
	fs.watch(dir, debounce(function(event) {
		// console.log('watch event…');
		gulp.start.apply(gulp, tasks);
	}, 100));
}

module.exports = watch;