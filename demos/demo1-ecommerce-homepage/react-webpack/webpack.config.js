const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 问题2: 未做代码分割，所有代码打包到一个文件
    // 问题2: 文件名不带 hash，无法利用缓存
    filename: 'bundle.js',
    clean: true
  },
  // 问题2: 禁用代码压缩
  optimization: {
    minimize: false,
    splitChunks: false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        // 问题3: CSS 提取为外部文件，不内联，导致渲染阻塞
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // 问题1: 图片不进行压缩优化处理
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    // 问题3: CSS 提取为外部文件
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 3001,
    hot: true,
    open: false
  }
};
