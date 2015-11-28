'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var SystemBellPlugin = require('system-bell-webpack-plugin');

//////////////////////////
// Webpack configuration
//////////////////////////
var loaders = [
  { test: /\.tsx?$/, loader: 'ts', exclude: /node_modules/ },
  //{ test: /\.jsx?$/, loader: 'babel', query: { cacheDirectory: true, presets: ['react', 'es2015'] }, exclude: /node_modules/ },
  { test: /\.json$/, loader: 'json' },
];
var plugins;
if (process.env.NODE_ENV === 'production') {
  plugins = [
    new webpack.DefinePlugin({ __DEV__: false, 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.UglifyJsPlugin({ comments: / ^/, compress: { warnings: false }}),
  ];
} else {
  plugins = [
    new webpack.DefinePlugin({ __DEV__: true }),
    new SystemBellPlugin(),
  ];
}
var resolve = {
  extensions: ['', '.ts', '.tsx'],
};

///////////////////////
// Client-side bundle
///////////////////////

// var client = {
//   cache: true,
//   entry: './src/browser-main.ts',
//   output: {
//     path: './public/a2b8e37dbe533b/', // Avoid clashes with any subdirectory names
//     filename: 'browser.bundle.js'
//   },

//   module: {
//     loaders: loaders.concat({ test: /\.styl$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer!stylus') })
//   },
//   plugins: plugins.concat(new ExtractTextPlugin('main.bundle.css')),
//   resolve: resolve,
// };

///////////////////////
// Server-side bundle
///////////////////////

var server = {
  cache: true,
  entry: './src/lumos-main.ts',
  output: {
    path: './build/',
    filename: 'lumos.bundle.js',
    libraryTarget: 'commonjs2'
  },

  module: {
    loaders: loaders.concat(
      { test: /\.styl$/, loader: 'raw' }
    )
  },
  plugins: plugins,
  resolve: resolve,

  externals: /^[a-z][a-z\d\.\-]*$/, // Don't bundle packages
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
};

module.exports = [ server ];