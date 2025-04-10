require('dotenv').config();

// Webpack config for LIFF
//
// Reference:
// https://github.com/sveltejs/template-webpack
// https://github.com/hperrin/smui-example-webpack/blob/master/webpack.config.js

const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const babelLoaderConfig = {
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            // https://g0v.hackmd.io/pDyGj-w0QPWKdV2gp2h9LQ#LIFF-compatibility
            ios: '10',
            android: '52',
          },
          useBuiltIns: 'entry',
          corejs: 3,
        },
      ],
    ],
  },
};

module.exports = {
  entry: {
    index: './src/liff/index.js',
    redirect: './src/liff/redirect.js',
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: __dirname + '/liff',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          // As long as we use useBuiltIns: 'entry' in preset-env, we don't need to process node_modules.
          // All polyfills are included by `import 'core-js'` statement in liff/index.
          path.resolve(__dirname, 'node_modules'),
        ],
        use: [babelLoaderConfig],
      },
      {
        // Langfuse SDK
        test: /node_modules\/langfuse/,
        type: 'javascript/auto', // https://stackoverflow.com/a/74957466/1582110
        use: [babelLoaderConfig],
      },
      {
        test: /\.svelte$/,
        use: [
          babelLoaderConfig,
          {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              hotReload: !prod,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              generator: (content) => svgToMiniDataURI(content.toString()),
            },
          },
        ],
      },
    ],
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/liff/index.html',
      chunks: ['index'],
      // custom constants passed to index.html via htmlWebpackPlugin.options
      ROLLBAR_ENV: process.env.ROLLBAR_ENV,
      ROLLBAR_CLIENT_TOKEN: process.env.ROLLBAR_CLIENT_TOKEN,
      GTM_ID: process.env.GTM_ID,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/liff/redirect.html',
      filename: 'redirect.html',
      chunks: ['redirect'],
      // custom constants passed to index.html via htmlWebpackPlugin.options
      GTM_ID: process.env.GTM_ID,
    }),
    new CompressionPlugin(),
    new DefinePlugin({
      LIFF_ID: JSON.stringify(
        (process.env.LIFF_URL || '').replace('https://liff.line.me/', '')
      ),
      DEBUG_LIFF: process.env.DEBUG_LIFF,
      'process.env.SITE_URLS': JSON.stringify(process.env.SITE_URLS),
      'process.env.LOCALE': JSON.stringify(process.env.LOCALE),
      NOTIFY_METHOD: JSON.stringify(process.env.NOTIFY_METHOD),
    }),
  ],
  devtool: prod ? false : 'source-map',
  optimization: {
    minimize: prod,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // We are supporting iOS 7, which uses Safari 10 by default.
          // Solves "Cannot declare a let variable twice".
          safari10: true,
        },
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  },

  devServer: {
    port: process.env.LIFF_DEV_PORT,
    publicPath: '/liff/',

    // Browserstack is having issue testing iOS on localhost domain, use ngrok instead:
    // https://www.browserstack.com/question/663
    //
    // Disable host name check to enable ngrok:
    // https://github.com/webpack/webpack-dev-server/issues/1604#issue-393549402
    //
    disableHostCheck: true,
  },
};
