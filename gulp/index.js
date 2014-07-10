var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

var taskdir = path.join(__dirname, 'tasks');

// Load tasks
fs.readdirSync(taskdir).forEach(function(filename) {
	var extension = path.extname(filename);
	var basename = path.basename(filename, extension);

	// Ignore non-.js files
	if (extension !== '.js') {
		return;
	}

	// Require the file and check if it has the right format
	var task = require(path.join(taskdir, filename));
	if (!(task.dep || task.fn)) {
		console.warn('gulp: File "' + filename + '" does not have the right format');
		return;
	}

	// Register task
	gulp.task(basename, task.dep, task.fn);
});