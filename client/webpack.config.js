const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/js/app.js',
  },
  output: {
    filename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        exclude: path.resolve(__dirname, 'src/index.html'),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            // Location where image is copied to.
            outputPath: 'img/',
            // Allows us to reference images correctly in places where needed.
            publicPath: 'img/',
          },
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: './dist',
    port: 8080,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new CleanWebpackPlugin(),
  ],
};
