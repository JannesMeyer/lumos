exports.fn = function() {
	var gulp = require('gulp');
	var livereload = require('gulp-livereload');
	var config = require('./gulp.config.json');

	var server = livereload();
	gulp.watch(config.watch.public).on('change', function(file) {
		server.changed(file.path);
	});
};