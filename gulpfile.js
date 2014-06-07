'use strict';

/*
	Rather than manage one giant configuration file responsible
	for creating multiple tasks, each task has been broken out into
	its own file in `gulpDir`.

	To add a new task, simply add a new task file to `gulpDir`.
*/
var gulpDir = './gulp/';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

// Load tasks from files in `gulpDir`
fs.readdirSync(path.join(__dirname, gulpDir))
.filter(function(filename) {
    return path.extname(filename) === '.js';
})
.forEach(function(filename) {
	var t = require(gulpDir + filename);
	t.name = path.basename(filename, '.js');
	gulp.task(t.name, t.dep, t.fn);
});

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