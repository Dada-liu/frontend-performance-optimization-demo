const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')

// 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Critters = require('critters-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 问题2: 文件名不带 hash，无法利用缓存
    // filename: 'bundle.js',
    filename: '[name].[contenthash].js', // 使用 contenthash 利于缓存
    clean: true
  },
  // 问题: 禁用代码压缩 和 拆分打包文件
  // optimization: {
  //   minimize: false,
  //   splitChunks: false
  // },
  optimization: {
    usedExports: true, // 生成模式默认开启，给没有被使用的导出打上标记
    // 问题2: 未做代码分割，所有代码打包到一个文件
    // splitChunks: true,
    splitChunks: {
      chunks: 'all', // 对所有代码（同步+异步）都拆分
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\]/,
          name: 'vendors', // 打包成 vendors.js
          chunks: 'all'
        }
      }
    },
    runtimeChunk: 'single', // 配合缓存利用方案
    minimize: true,
    // 问题2: JS、CSS 压缩
    minimizer: [
      `...`, // 保留默认 minimizer（Terser，用来压缩js）
      // CSS压缩
      new CSSMinimizerPlugin(),
      // 图片压缩
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpGenerate,
          // implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              // png: { quality: 70 }, // 压缩PNG
              // jpeg: { quality: 70 },
              webp: { quality: 70 } // 可选：转WebP
            }
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', 
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        // 问题3: CSS 提取为外部文件，不内联，导致渲染阻塞
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // 问题1: 图片压缩优化
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: { filename: 'assets/images/[name].[hash][ext]' }
      },
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
      filename: '[name].[contenthash].css'
    }),
    // 自动内联「初始chunk关键CSS」
    new Critters({
      inline: true,          // 内联关键CSS
      minify: true,           // 压缩内联CSS
      extract: true,           // 提取剩余CSS为外部文件
      publicPath: '/',         // 资源公共路径
      preload: 'media',        // 预加载非关键CSS
    }),
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
