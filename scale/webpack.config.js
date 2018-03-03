const path = require('path');
const webpack = require('webpack');

const config = {
  context: path.join(__dirname, 'src'),
  entry: {
    planets: './planets.js',
    vendor: ['d3-selection', 'd3-scale', 'd3-transition']
  },
  resolve: {
    root: path.join(__dirname, 'src')
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'static/js/[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'static/js/vendor.js',
      minChunks: Infinity
    })
  ]
};

switch(process.env.npm_lifecycle_event){
case 'start':
  config.entry.planets = [
    'webpack-dev-server/client?http://0.0.0.0:8000',
    'webpack/hot/only-dev-server',
    './planets.js'
  ]

  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ]);
  
  break;
case 'build':
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,
      compress: {
        warnings: false
      }
    })
  ]);
  break;
}

module.exports = config;
