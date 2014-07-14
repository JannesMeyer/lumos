exports.dep = ['build', 'node'];
exports.fn = function() {
	var gulp = require('gulp');
	// Because of the dependencies this is guaranteed to be compiled
	var watch = require('../../dist/lib/watch');
	var config = require('../gulp.config');

	var ignoredFiles = [ '.DS_Store' ];

	watch.debounced(config.watch.styles, function(event, filename) {
		// TODO: due to the debouncing filename tests are inaccurate
		if (ignoredFiles.indexOf(filename) !== -1) { return; }

		gulp.start('build-stylus');
	});
	watch.debounced(config.watch.javascripts, function(event, filename) {
		// TODO: due to the debouncing filename tests are inaccurate
		if (ignoredFiles.indexOf(filename) !== -1) { return; }

		gulp.start('build-js-client', 'node');
	});
};