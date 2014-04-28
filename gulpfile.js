'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var livereload = require('gulp-livereload');
var traceur = require('gulp-traceur');

var paths = {
	stylus: 'assets/stylus/**/*.styl',
	stylesheets: 'public/stylesheets',
	js: 'src/**/*.js'
};

// gulp: https://github.com/gulpjs/gulp
// https://github.com/gulpjs/gulp/blob/master/docs/API.md
// gulp-util: https://github.com/gulpjs/gulp-util
// gulp-stylus: https://github.com/stevelacy/gulp-stylus
// gulp-nodemon: https://github.com/JacksonGariety/gulp-nodemon/issues/14
// https://gist.github.com/webdesserts/5632955


// http://rhumaric.com/2014/01/livereload-magic-gulp-style/
// Notifies livereload of changes detected
// by `gulp.watch()`
// function notifyLivereload(event) {

//   // `gulp.watch()` events provide an absolute path
//   // so we need to make it relative to the server root
//   var fileName = require('path').relative(EXPRESS_ROOT, event.path);

//   lr.changed({
//     body: {
//       files: [fileName]
//     }
//   });
// }

// Default task
gulp.task('default', ['stylesheets', 'javascripts']);

// Run dev environment
gulp.task('dev', ['default', 'node-server', 'livereload-server'], function() {
	gulp.watch(paths.stylus, ['stylesheets']);
	gulp.watch(paths.js, ['javascripts', 'node-server']);
});

// Node server
var nodeServer;
function killNodeServer() {
	if (nodeServer) {
		nodeServer.kill();
	}
}
gulp.task('node-server', function() {
	killNodeServer();

	var child_process = require('child_process');
	nodeServer = child_process.spawn('./bin/www', undefined, { stdio: 'inherit' });
	nodeServer.stdout.setEncoding('utf8');
	nodeServer.stdout.on('data', function (data) {
		gutil.log(data.trim());
	});
	nodeServer.stderr.setEncoding('utf8');
	nodeServer.stderr.on('data', function (data) {
		gutil.log(gutil.colors.red(data.trim()));
	});
	nodeServer.on('close', function(code) {
		if (code === 8) {
			gutil.log('Error detected, waiting for changes...');
		}
	});
});
// Clean up if an error goes unhandled
process.on('exit', killNodeServer);


// LiveReload server
// var lrServer;
// gulp.task('livereload-server', function() {
// 	lrServer = require('tiny-lr-fork')();
// 	lrServer.listen(35729);
// });
gulp.task('livereload-server', function() {
	var server = livereload();
	gulp.watch('public/**').on('change', function(file) {
		server.changed(file.path);
	});
});

// Compile Stylus
gulp.task('stylesheets', function() {
	gulp.src(paths.stylus)
		.pipe(stylus())
		.pipe(gulp.dest(paths.stylesheets));
});

// Compile JavaScript
gulp.task('javascripts', function () {
	gulp.src(['src/app.js', 'src/denodeify.js', 'src/directory.js'])
		.pipe(traceur({ sourceMap: true, experimental: true }))
		.pipe(gulp.dest('dist'));
});