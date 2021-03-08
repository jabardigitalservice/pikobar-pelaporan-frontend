const path = require('path')
const pkg = require('./package.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const vueEnverywere = require('vue-enverywhere')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')

let plugins = [
  new vueEnverywere({ filename: 'env-vars.js' }),
  new MiniCssExtractPlugin({
    filename: "[name].css",
  }),
  new webpack.IgnorePlugin(
    /^\.\/locale$/, /moment$/
  ),
  new PreloadWebpackPlugin({
    rel: 'prefetch',
    as: 'script'
  }),
  // new BundleAnalyzerPlugin()
]

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = pkg.name || 'template-vuetify' // page title
const port = 8080 // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development' ? 'error' : false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:${port}/`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins,
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/firebase-messaging-sw.js'
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.when(process.env.NODE_ENV === 'development', config =>
      config.devtool('cheap-source-map')
    )
    config.when(process.env.NODE_ENV === 'production', config => {
      config.performance
        .maxEntrypointSize(400000)
        .maxAssetSize(400000)
      config.optimization.splitChunks({
        chunks: 'all',
        maxSize: 400000,
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          vuetify: {
            name: 'chunk-vuetify', // split vuetify into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]vuetify[\\/]/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.minimizer("terser").tap(args => {
        const { terserOptions } = args[0]
        terserOptions.compress = true
        return args
      })
      config.optimization.runtimeChunk('single')
    })
  },
  transpileDependencies: ['vuetify']
}
