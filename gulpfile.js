'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;

// Config: source files
var srcStyles = 'assets/stylus/*.styl';
var srcScriptsClient = './src/client/index.js';
var srcScriptsServer = 'src/*.js';
var srcComponents = 'components-jsx/*.jsx';

// Config: destination files
var destStyles = 'public/stylesheets';
var destScriptsClient = 'public/javascripts';
var destScriptsServer = 'dist';
var destComponents = 'components-js';

// Config: watch files
var watchStyles = 'assets/stylus';
var watchPublic = 'public';


/********************************
   Helper functions
 ********************************/

function startNode() {
	process.env.LUMOSPATH = '/Users/jannes/Dropbox/Notes';
	var options = {
		env: process.env,
		stdio: 'inherit'
	};
	childs.node = spawn('./bin/lumos', ['serve'], options);
}
function stopNode() {
	if (childs.node) {
		childs.node.kill();
	}
}
function gulpLog(chunk) {
	gutil.log(chunk.toString().trim());
}
function gulpLogError(chunk) {
	gutil.log(gutil.colors.red(chunk.toString().trim()));
}

/********************************
   Tasks
 ********************************/

var childs = {};

gulp.task('default', function() {
	gutil.log('Available tasks:');
	for (var task in gulp.tasks) {
		if (task === 'default') { continue; }
		gutil.log('• ' + gutil.colors.cyan(task));
	}
});

gulp.task('build', ['build-stylus', 'build-js-client', 'build-js-server', 'build-jsx']);

gulp.task('build-stylus', function() {
	var stylus = require('gulp-stylus');
	var autoprefixer = require('gulp-autoprefixer');
	var minifycss = require('gulp-minify-css');
	var rename = require('gulp-rename');

	gulp.src(srcStyles)
		.pipe(stylus({ errors: true }))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest(destStyles))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest(destStyles));
});

gulp.task('build-js-client', function() {
	var browserify = require('browserify');
	var sourceStream = require('vinyl-source-stream');
	var uglify = require('gulp-uglify');
	var streamify = require('gulp-streamify');
	var rename = require('gulp-rename');

	browserify(srcScriptsClient)
	    .bundle()
	    .pipe(sourceStream('client.js'))
	    .pipe(gulp.dest(destScriptsClient));
	    // .pipe(rename({ suffix: '.min' }))
	    // .pipe(streamify(uglify()))
	    // .pipe(gulp.dest(destScriptsClient));
});

gulp.task('build-js-server', function() {
	var traceur = require('gulp-traceur');
	// var changed = require('gulp-changed');

	gulp.src(srcScriptsServer)
		.pipe(traceur({ sourceMap: true, experimental: true }))
		.pipe(gulp.dest(destScriptsServer));
});

gulp.task('build-jsx', function() {
	var react = require('gulp-react');

	gulp.src(srcComponents)
		.pipe(react({ harmony: true }))
		.pipe(gulp.dest(destComponents));
});

gulp.task('dev', ['build', 'node'], function() {
	gulp.watch(watchStyles, ['build-stylus']);
	gulp.watch(srcScriptsClient, ['build-js-client']);
	gulp.watch(srcScriptsServer, ['build-js-server', 'node']);
	gulp.watch(srcComponents, ['build-jsx']);
});

// gulp.task('node-inspector', function() {
// 	childs.node = spawn('node', ['--harmony', '--debug', './bin/lumos', 'serve'], options);
// 	childs.inspector = spawn('node-inspector', { stdio: 'inherit' });
// });

gulp.task('node', function() {
	stopNode();
	startNode();
});
process.on('exit', stopNode);

gulp.task('livereload', function() {
	var livereload = require('gulp-livereload');

	childs.livereload = livereload();
	gulp.watch(watchPublic).on('change', function(file) {
		childs.livereload.changed(file.path);
	});
});