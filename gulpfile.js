'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
// var changed = require('gulp-changed');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var traceur = require('gulp-traceur');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var spawn = require('child_process').spawn;


// Config: source files
var srcStyles = './assets/stylus/*.styl';
var srcStylesAll = './assets/stylus/**/*.styl';
var srcScriptsClient = './assets/javascripts/*.js';
var srcScriptsServer = './src/**/*.js';

// Config: destination files
var destStyles = './public/stylesheets';
var destScriptsClient = './public/javascripts';
var destScriptsServer = './dist';

// Config: watch files
var watchPublic = './public/';


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
		if (task === 'default') {
			continue;
		}
		gutil.log('• ' + gutil.colors.cyan(task));
	}
});

gulp.task('stylesheets', function() {
	gulp.src(srcStyles)
	    .pipe(stylus({ errors: true }))
	    .pipe(autoprefixer('last 2 versions'))
	    .pipe(gulp.dest(destStyles))
	    .pipe(rename({ suffix: '.min' }))
	    .pipe(minifycss())
	    .pipe(gulp.dest(destStyles));
});

gulp.task('scripts-client', function() {
	gulp.src(srcScriptsClient)
		.pipe(concat('main.js'))
	    // .pipe(traceur({ sourceMap: true, experimental: true }))
	    .pipe(gulp.dest(destScriptsClient))
	    .pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(destScriptsClient));
});

gulp.task('scripts-server', function() {
	gulp.src(srcScriptsServer)
	    .pipe(traceur({ sourceMap: true, experimental: true }))
	    .pipe(gulp.dest(destScriptsServer));
});

gulp.task('dev', ['stylesheets', 'scripts-client', 'scripts-server', 'node', 'livereload'], function() {
	gulp.watch(srcStylesAll, ['stylesheets']);
	gulp.watch(srcScriptsClient, ['scripts-client']);
	gulp.watch(srcScriptsServer, ['scripts-server', 'node']);
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
	childs.livereload = livereload();
	gulp.watch(watchPublic).on('change', function(file) {
		childs.livereload.changed(file.path);
	});
});