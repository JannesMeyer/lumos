module.exports.dep = ['build', 'node'];
module.exports.fn = function() {
	var gulp = require('gulp');
	var paths = require('./paths.json');

	gulp.watch(paths.watch.styles, ['build-stylus']);
	gulp.watch(paths.src.clientJS, ['build-js-client']);
	gulp.watch(paths.src.serverJS, ['build-js-server', 'node']);
	gulp.watch(paths.src.components, ['build-jsx']);
};