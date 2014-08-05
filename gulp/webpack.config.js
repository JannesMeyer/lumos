'use strict';
var webpack = require('webpack');
var path = require('path');
var getPath = path.join.bind(path, __dirname, '..');

module.exports = {
	cache: true,
	entry: './src/browser-main.js',
	output: {
		path: './public/a2b8e37dbe533b/javascripts/',
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.(?:js|jsx)$/,
				loader:  'es6-loader',
				include: [ getPath() ],
				exclude: [ getPath('node_modules') ]
			}
		]
	},
	resolve: {
		root: getPath('src'),
		extensions: ['', '.js', '.jsx', '.json']
	}
};