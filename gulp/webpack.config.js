var path = require('path');
var config = require('./gulp.config');

function getDir(dir) {
	return path.join(__dirname, '..', dir);
}

module.exports = {
	cache: true,
	entry: config.webpack.entry,
	output: config.webpack.output,
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