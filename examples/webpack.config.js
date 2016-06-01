var path = require('path');
var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'inline-source-map',

  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, 'main.js')
  ],

  output: {
    path: path.join(__dirname, '__build__'),
    publicPath: '/__build__/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
      {test: /\.less$/, loader: 'style-loader!css-loader!postcss-loader!less-loader'}
    ]
  },

  postcss: function () {
    return [precss, autoprefixer];
  },

  resolve: {
    alias: {
      'react-mobile-picker': path.join(__dirname, '..', 'src')
    }
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
