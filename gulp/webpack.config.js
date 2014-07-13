var path = require('path');

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
	module: {
		loaders: [
			{ test: /\.jsx$/, loader:  'es6-loader' },
			{ test: /\.js$/, loader: 'es6-loader', exclude: [ resolveDir('node_modules') ] }
		]
	},
	resolve: {
		root: resolveDir('src'),
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
	}
};