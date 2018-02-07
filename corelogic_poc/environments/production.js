const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  /**
   * Adds chunkhashes to all of webpack's output. This is useful for caching resources
   * and by using a chunkhash the name won't change unless the file in that chunk has been modified
   * 
   * @author jordanskomer
   */
  filenames: {
    js: '[name].[chunkhash].js',
    css: '[name].[contenthash].css'
  },
  postcssPlugins: [
    require('cssnano')({
      preset: 'default',
    })
  ],
  plugins: [
    /**
     * Uglify the JS so it is nice a small for production
     * 
     * @author jordanskomer
     */
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    }),

    /**
     * Turns variable and functions names into ids to make the js smaller
     * 
     * @author jordanskomer
     */
    new webpack.HashedModuleIdsPlugin(),

    /**
     * Gzip everything that can be gzipped
     * 
     * @author jordanskomer
     */
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}
