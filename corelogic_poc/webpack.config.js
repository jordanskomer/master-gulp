const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path              = require('path')
const glob              = require('glob')
const webpack           = require('webpack')
const config            = require('./environments/' + process.env.NODE_ENV)


const postcssPlugins = [
  require('postcss-cssnext')(),
  require('postcss-nested')(),
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
   * Extract anything used that is in the node_modules folder and is used
   * more then once into its own bundle.
   * @author jordanskomer
   */
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks(module, count) {
      let context = module.context;
      return context && context.indexOf('node_modules') >= 0;
    },
  }),

  /**
   * Extract webpack boiler plate into its own js file
   *
   * @author jordanskomer
   */
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
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
            limit: 50000,
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
          options: {
            presets: ['env']
          }
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
