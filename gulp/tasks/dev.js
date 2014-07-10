exports.dep = ['build', 'node'];
exports.fn = function() {
	var watch = require('../gulp-watch');
	var config = require('../gulp.config');

	watch(config.watch.styles, ['build-stylus']);
	watch(config.watch.javascripts, ['build-js-client', 'node']);
};