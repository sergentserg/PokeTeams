const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // Production modes minifies our code.
  mode: 'production',
  entry: {
    index: './src/home/index.js',
    auth: './src/auth/index.js',
    app: './src/app/index.js',
  },
  output: {
    filename: './js/[name].[contenthash].bundle.js',
    // Webpack needs an absolute path to write our files.
    path: path.resolve(__dirname, 'dist'),
  },
  // Allows trace stack error to point to correct error source file (avoid in production)
//  devtool: 'inline-source-map',
  // Allows the 'src' directory to be used as the top-level of an import statement.
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
        test: /\.(jpg|jpeg|png|svg|gif|ico)$/,
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
      chunks: ['auth'],
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: 'src/app/index.html',
      chunks: ['app'],
    }),
    new CleanWebpackPlugin(),
  ],
};
