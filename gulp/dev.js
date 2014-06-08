module.exports.dep = ['build', 'node'];
module.exports.fn = function() {
	var gulp = require('gulp');
	var config = require('./gulpconfig.json');

	gulp.watch(config.watch.styles, ['build-stylus']);
	gulp.watch(config.src.clientJS, ['build-js-client']);
	gulp.watch(config.src.serverJS, ['build-js-server', 'node']);
	gulp.watch(config.src.components, ['build-jsx']);
};