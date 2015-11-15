'use strict';

var webpack = require('webpack');

//////////////////////////
// Webpack configuration
//////////////////////////
var config = {
  cache: true,
  module: {
    loaders: [
      { test: /\.css$/,  loaders: ['style', 'css', 'autoprefixer'] },
      { test: /\.styl$/, loaders: ['style', 'css', 'autoprefixer', 'stylus'] },
      { test: /\.jsx?$/, loader: 'babel', query: { presets: ['react', 'es2015'] }, exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.web.js']
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins = [
    new webpack.DefinePlugin({ __DEV__: false, 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.UglifyJsPlugin({ comments: / ^/, compress: { warnings: false }})
  ];
} else {
  config.plugins = [
    new webpack.DefinePlugin({ __DEV__: true })
  ];
}

///////////////////////
// Client-side bundle
///////////////////////

var client = Object.assign({
  entry: './src/browser-main.js',
  output: {
    path: './public/a2b8e37dbe533b/javascripts/', // Avoid clashes with any subdirectory names
    filename: 'browser.bundle.js'
  }
}, config);

///////////////////////
// Server-side bundle
///////////////////////

var server = Object.assign({
  entry: './src/lumos-main.js',
  output: {
    path: './dist/',
    filename: 'lumos.bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: /^[a-z][a-z\d\.\-]*$/, // Don't bundle packages
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
}, config);

module.exports = [ client, server ];