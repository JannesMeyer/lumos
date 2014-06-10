module.exports.fn = function(callback) {
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
				{ test: /\.jsx$/, loader: "jsx-loader?harmony&insertPragma=React.DOM" },
				{ test: /\.js$/, loader: "jsx-loader?harmony" }
	        ]
		},
		resolve: {
		    extensions: ['', '.js'],
		    modulesDirectories: ['src', 'node_modules']
		}
	};

    return webpack(webpackConfig, function(err, stats) {
        if(err) {
        	throw new gutil.PluginError('webpack', err);
        }
        console.log(stats.toString({ colors: true }));
        callback();
    });
};