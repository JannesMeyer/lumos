exports.dep = ['build', 'node'];
exports.fn = function() {
	var gulp = require('gulp');
	var watch = require('../../dist/lib/watch');
	var config = require('../gulp.config');

	var ignoredFiles = [ '.DS_Store' ];
	function isIgnoredFile(filename) {
		if (filename === undefined) {
			return false;
		}
		return ignoredFiles.indexOf(filename) !== -1;
	}

	watch(config.watch.styles, function(event, filename) {
		gulp.start('build-stylus');
	});
	watch(config.watch.javascripts, function(event, filename) {
		if (isIgnoredFile(filename)) {
			return;
		}
		gulp.start('build-js-client', 'node');
	});
};