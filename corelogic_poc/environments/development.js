const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  filenames: {
    js: '[name].js',
    css: '[name].css'
  },
  postcssPlugins: [],
  plugins: [
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development, 
      // ./public directory is being served 
      host: 'localhost',
      port: 8000,
      files: 'public/*',
      proxy: 'http://localhost:8080/',
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    // }),
    new HtmlWebpackPlugin({
      title: 'App',
      template: 'index.html'
    })
  ]
}