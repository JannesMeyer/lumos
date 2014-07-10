var path = require('path');

function getDir(dir) {
	return path.join(__dirname, '..', dir);
}

module.exports = {
	cache: true,
	entry: './src/browser-main.js',
	output: {
		path: './public/javascripts/',
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.jsx$/, loader:  'es6-loader' },
			{ test: /\.js$/, loader: 'es6-loader', exclude: [ getDir('node_modules') ] }
		]
	},
	resolve: {
		root: getDir('src'),
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
	}
};