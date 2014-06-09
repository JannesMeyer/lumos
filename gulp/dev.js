module.exports.dep = ['build', 'node'];
module.exports.fn = function() {
	var gulp = require('gulp');
	var config = require('./gulp.config.json');

	gulp.watch(config.watch.styles, ['build-stylus']);
	// gulp.watch(config.src.clientJS, ['build-js-client']);
	gulp.watch(config.src.serverJS, ['node']);
	gulp.watch(config.src.components, ['build-jsx']);
};