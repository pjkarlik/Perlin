
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const pkgInfo = require('./package.json');
const { name, version, description } = pkgInfo;
const fs = require('fs');
fs.writeFileSync('version.json', JSON.stringify({ name, version, description }));

const config = {
  name: 'Perlin',
  target: 'web',
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  entry: './src/index.js',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        include: [/src/],
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        loader: 'style!css',
        include: [/resources/],
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file',
      },
      {
        test: /\.(wav)$/,
        loader: 'file',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
    preLoaders: [
      { test: /\.js$/,
        loader: 'eslint-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      css: 'styles/styles.css',
      title: 'Perlin',
      favicon: './resources/images/favicon.png',
      template: './resources/templates/template.ejs',
      inject: 'body',
      hash: true,
    }),
  ],
};

module.exports = config;
