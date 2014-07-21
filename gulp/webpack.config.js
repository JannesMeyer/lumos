var path = require('path');
var webpack = require('webpack');

function resolveDir(dir) {
	return path.join(__dirname, '..', dir);
}

module.exports = {
	cache: true,
	entry: './src/browser-main.js',
	output: {
		path: './public/a2b8e37dbe533b/javascripts/',
		filename: '[name].bundle.js'
	},
	plugins: [
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': '\'production\'' })
		// ,new webpack.optimize.UglifyJsPlugin()
	],
	module: {
		loaders: [
			{ test: /\.jsx$/, loader:  'es6-loader', exclude: [ resolveDir('node_modules') ] },
			{ test: /\.js$/, loader: 'es6-loader', exclude: [ resolveDir('node_modules') ] }
		]
	},
	resolve: {
		root: resolveDir('src'),
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
	}
};