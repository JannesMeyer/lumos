/*
	Rather than manage one giant configuration file responsible
	for creating multiple tasks, each task has been broken out into
	its own file in `gulpDir`.

	To add a new task, simply add a new task file to `gulpDir`.
*/

require('./gulp');
var gulp = require('gulp');

// Default task
gulp.task('default', function() {
	console.log('\nAvailable tasks:');
	for (var task in gulp.tasks) {
		if (task === 'default') {
			continue;
		}
		console.log(' • ' + task);
	}
	console.log('');
});