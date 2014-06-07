module.exports.fn = function() {
	var gulp = require('gulp');
	var livereload = require('gulp-livereload');
	var paths = require('./paths.json');

	var server = livereload();
	gulp.watch(paths.watch.public).on('change', function(file) {
		server.changed(file.path);
	});
};