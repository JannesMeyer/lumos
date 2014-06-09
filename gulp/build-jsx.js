var path = require('path');
var gutil = require('gulp-util');
var webpack = require('webpack');

var webpackConfig = {
	cache: true,
	entry: './components-jsx/page.jsx',
	output: {
	    path: './public/javascripts/',
	    filename: '[name].bundle.js'
	},
	module: {
        loaders: [
			{ test: /\.jsx$/, loader: "jsx-loader?harmony&insertPragma=React.DOM" }
        ]
	},
	resolve: {
	    extensions: ['', '.js', '.jsx'],
	    modulesDirectories: ['src', 'node_modules']
	}
};

module.exports.fn = function(callback) {
    return webpack(webpackConfig, function(err, stats) {
        if(err) {
        	throw new gutil.PluginError('webpack', err);
        }
        console.log(stats.toString());
        // gutil.log("[webpack]", stats.toString());
        callback();
    });
}

// module.exports.fn = function() {
// 	var gulp = require('gulp');
// 	var plumber = require('gulp-plumber');
// 	var notify = require('gulp-notify');
// 	var react = require('gulp-react');
// 	var traceur = require('gulp-traceur');
// 	var config = require('./gulp.config.json');

// 	return gulp.src(config.src.components)
// 		.pipe(plumber({ errorHandler: notify.onError(config.errorTemplate) }))
// 		.pipe(react({ harmony: true }))
// 		.pipe(traceur())
// 		.pipe(gulp.dest(config.dest.components));
// };