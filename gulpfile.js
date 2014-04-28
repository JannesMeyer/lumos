'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var traceur = require('gulp-traceur');

var paths = {
	nodeScript: './bin/www',

	stylus: 'assets/stylus/**/*.styl',
	stylusTarget: 'public/stylesheets',

	serverJs: 'src/**/*.js',
	serverJsTarget: 'dist',

	publicFiles: 'public/**',
	viewFiles: 'views/**'
};

/*
gulp: https://github.com/gulpjs/gulp
https://github.com/gulpjs/gulp/blob/master/docs/API.md
gulp-util: https://github.com/gulpjs/gulp-util
gulp-stylus: https://github.com/stevelacy/gulp-stylus
gulp-nodemon: https://github.com/JacksonGariety/gulp-nodemon/issues/14
https://gist.github.com/webdesserts/5632955
http://rhumaric.com/2014/01/livereload-magic-gulp-style/
  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);
*/

// Default task
gulp.task('default', ['stylesheets', 'javascripts']);

// Compile Stylus
gulp.task('stylesheets', function() {
	gulp.src(paths.stylus)
		.pipe(stylus())
		.pipe(gulp.dest(paths.stylusTarget));
});

// Compile server-side JavaScript
gulp.task('javascripts', function () {
	gulp.src(paths.serverJs)
		.pipe(traceur({ sourceMap: true, experimental: true }))
		.pipe(gulp.dest(paths.serverJsTarget));
});

// Run dev environment
gulp.task('dev', ['default', 'node-server', 'livereload-server'], function() {
	gulp.watch(paths.stylus, ['stylesheets']);
	gulp.watch(paths.serverJs, ['javascripts', 'node-server']);
});

// Node server
var nodeServer;
function killNodeServer() {
	if (nodeServer) {
		nodeServer.kill();
	}
}
gulp.task('node-server', function() {
	var child_process = require('child_process');

	killNodeServer();
	nodeServer = child_process.spawn(paths.nodeScript, undefined, { stdio: 'inherit' });
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
process.on('exit', killNodeServer);

// LiveReload server
gulp.task('livereload-server', function() {
	var livereload = require('gulp-livereload');
	var server = livereload();

	gulp.watch([paths.publicFiles, paths.viewFiles]).on('change', function(file) {
		server.changed(file.path);
	});
});