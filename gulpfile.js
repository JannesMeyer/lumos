'use strict';

// sudo PORT=80 gulp node-server
// gulp dev

var child_process = require('child_process');

var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var traceur = require('gulp-traceur');

var paths = {
	nodeScript: './bin/www',

	stylus: 'assets/stylus/*.styl',
	stylusTarget: 'public/stylesheets',

	serverJs: 'src/**/*.js',
	serverJsTarget: 'dist',

	publicFiles: 'public/**',
	viewFiles: 'views/**',

	markdownFiles: '/Users/jannes/Dropbox/Notes/**/*.md'
};

// Default task
gulp.task('default', ['stylesheets', 'javascripts']);

// Compile Stylus
gulp.task('stylesheets', function() {
	gulp.src(paths.stylus)
		.pipe(stylus({ errors: true }))
		.pipe(gulp.dest(paths.stylusTarget));
});

// Compile server-side JavaScript
gulp.task('javascripts', function() {
	gulp.src(paths.serverJs)
		.pipe(traceur({ sourceMap: true, experimental: true }))
		.pipe(gulp.dest(paths.serverJsTarget));
});

// Run dev environment
gulp.task('dev', ['default', 'node-server', 'livereload-server'], function() {
	gulp.watch('assets/stylus/**/*.styl', ['stylesheets']);
	gulp.watch(paths.serverJs, ['javascripts', 'node-server']);
});

// Run debug environment
gulp.task('debug', ['default', 'node-server', 'livereload-server', 'node-inspector'], function() {
	gulp.watch('assets/stylus/**/*.styl', ['stylesheets']);
	gulp.watch(paths.serverJs, ['javascripts', 'node-server']);
});

// Node inspector
var nodeInspector;
gulp.task('node-inspector', function() {
	nodeInspector = child_process.spawn('node-inspector');
	nodeInspector.stdout.setEncoding('utf8');
	nodeInspector.stdout.on('data', function (data) {
		gutil.log(gutil.colors.cyan('node') + ':', data.trim());
	});
	nodeInspector.stderr.setEncoding('utf8');
	nodeInspector.stderr.on('data', function (data) {
		gutil.log(gutil.colors.cyan('node') + ':', gutil.colors.red(data.trim()));
	});
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
	nodeServer = child_process.spawn('node', ['--harmony'/*, '--debug'*/, paths.nodeScript]);
	nodeServer.stdout.setEncoding('utf8');
	nodeServer.stdout.on('data', function (data) {
		gutil.log(gutil.colors.cyan('node') + ':', data.trim());
	});
	nodeServer.stderr.setEncoding('utf8');
	nodeServer.stderr.on('data', function (data) {
		gutil.log(gutil.colors.cyan('node') + ':', gutil.colors.red(data.trim()));
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

// Writing
gulp.task('writing', ['node-server'], function() {
	var livereload = require('gulp-livereload');
	var server = livereload();

	gulp.watch([paths.markdownFiles]).on('change', function(file) {
		server.changed(file.path);
	});
})