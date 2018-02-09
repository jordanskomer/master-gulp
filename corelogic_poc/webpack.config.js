const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path              = require('path')
const glob              = require('glob')
const webpack           = require('webpack')
const config            = require('./environments/' + process.env.NODE_ENV)
const HtmlWebpackPlugin = require('html-webpack-plugin')


const postcssPlugins = [
  require('postcss-cssnext')(),
  require('postcss-nested')(),
  require('postcss-assets')(),
  ...config.postcssPlugins
]

const plugins = [
  /**
   * Extract all .css into their own file
   *
   * @author jordanskomer
   */
  new ExtractTextPlugin('stylesheets/' + config.filenames.css),

  /**
   * Loads in the js and css files from webpack into the index.html page
   *
   * @author jordanskomer
   */
  new HtmlWebpackPlugin({
    template: './index.html',
    inject: 'head',
    title: 'Core Logic Demo',
    minify: process.env.NODE_ENV !== 'production' ? false : {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      removeComments: true,
      removeEmptyAttributes: true,
    },
    hash: true,
  }),

  /**
   * Loads in environment specific plugins
   *
   * @author jordanskomer
   */
  ...config.plugins
]


module.exports = {
  entry: {
    application:
      ['./app.js',
       './app.css'],
  },

  // Define where to save assets to
  output: {
    path: path.resolve('public'),
    filename: 'javascripts/' + config.filenames.js,
    publicPath: '/public'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => postcssPlugins
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jp(e*)g|svg|woff|woff2|eot|ttf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1,
            name: config.assetsFilename,
            publicPath: '../',
          }
        }]
      },
      {
        test: /\.js$/,
        include: path.resolve('app/assets/javascripts'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.css'],
  },

  // Plugins are loaded in the environment config
  plugins: plugins
}
