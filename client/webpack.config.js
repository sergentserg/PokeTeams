const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/home/index.js',
    login: './src/auth/index.js',
    app: './src/app/index.js',
  },
  output: {
    filename: './js/[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      // {
      //   test: /\.html$/,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       name: '[name].[ext]',
      //     },
      //   },
      //   exclude: path.resolve(__dirname, 'src/home/pages/index.html'),
      // },
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
            outputPath: './img/',
            // Allows us to reference images correctly in places where needed.
            publicPath: './img/',
          },
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current',
                  },
                },
              ],
            ],
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
      filename: './css/[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/home/index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'auth.html',
      template: 'src/auth/index.html',
      chunks: ['login'],
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: 'src/app/index.html',
      chunks: ['app'],
    }),
    new CleanWebpackPlugin(),
  ],
};
