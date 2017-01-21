var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  entry: {

    app: [
      './src/app/app.module.js'
    ],

    vendor: [
      'angular',
      'angular-ui-router',
      'bootstrap'
    ]

  },

  output: {
    filename: '[name].js',
    path: './public'
  },

  module: {
    loaders: [

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?sourceMap'
        })
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'raw-loader!sass-loader'
        })
      },

      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },

      {
        test: /\.html$/,
        loaders: ['html-loader']
      }

    ]
  },

  devtool: 'source-map',

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor','manifest']
    }),

    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false,
      allChunks: true
    }),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),

    new CopyWebpackPlugin(
      [
        {
          from: './src/app/index.html',
          to: './index.html'
        }
      ],
      {
        copyUnmodified: true
      }
    )

  ]

};