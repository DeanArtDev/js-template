const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const setLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-react',
          '@babel/preset-env',
        ],
      },
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

module.exports = {
  mode: 'development',

  entry: {
    main: path.resolve(__dirname, './source/index.js'),
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './public'),
  },

  devServer: {
    contentBase: path.resolve(__dirname, './public'),
    open: isDev,
    overlay: isDev,
    inline: isDev,
    port: 3030,
    historyApiFallback: true,
    hot: isDev,
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'source/index.html'),
      minify: {
        collapseWhitespace: isProd,
        removeComments: isProd,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './source/fonts'),
          to: path.resolve(__dirname, './public/fonts'),
        },
        {
          from: path.resolve(__dirname, './source/img'),
          to: path.resolve(__dirname, './public/img'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: setLoaders(),
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '../fonts/Roboto/[name].[ext]',
        },
      },
      {
        test: /\.(jpeg|svg|png)$/,
        loader: 'file-loader',
        options: {
          name: '../img/[name].[ext]',
        },
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: isDev,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.node', '.scss', '.sass', '.css'],
    alias: {
      '@root': path.resolve(__dirname, `./source`),
      '@components': path.resolve(__dirname, `./source/components`),
    },
  },

  devtool: isDev ? `source-map` : ``,
};
