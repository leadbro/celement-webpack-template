const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const postcssGlobalData = require('@csstools/postcss-global-data');

const routes = require('./src/routes.js')

const getPath = p => path.resolve(__dirname, p)

const routeInstances = routes.map(route => {
  const template = getPath(`./src/pages/${route.filename}`)
  const params = { ...route, template }
  return new HtmlWebpackPlugin(params)
})

module.exports = (env, options) => {
  const { mode } = options

  const isProd = mode === 'production'

  const entry = isProd
    ? { // Для продакшена
    base: [
      getPath('./src/entries/base.ts')
    ],
    styles: [
      getPath('./src/assets/styles/entries/root.js'),
      getPath('./src/assets/styles/common/fonts.css'),
      getPath('./src/assets/styles/entries/top.js'),
      getPath('./src/assets/styles/entries/common.js'),
      getPath('./src/assets/styles/entries/ui.js'),
      getPath('./src/assets/styles/entries/base.js'),
    ]
  }
    : [ // Для hot-reload
    getPath('./src/assets/styles/common/fonts.css'),
    getPath('./src/assets/styles/entries/root.js'),
    getPath('./src/entries/base.ts'),
    getPath('./src/assets/styles/entries/top.js'),
    getPath('./src/assets/styles/entries/common.js'),
    getPath('./src/assets/styles/entries/ui.js'),
    getPath('./src/assets/styles/entries/base.js'),
  ]


  const postcssPlugins = [
    postcssGlobalData({
        files: [
          getPath('./src/assets/styles/common/media.css')
        ]
    }),
    [
      'postcss-custom-media',
    ],
    [
      'postcss-mixins',
      {
        mixinsDir: [
          // Глобальные миксины
          getPath('./src/assets/styles/mixins'),
          // Миксины элементов форм
          getPath('./src/assets/styles/mixins/form'),
        ]
      }
    ],
    'postcss-easings',
    'postcss-for',
    'postcss-responsive-type',
    'postcss-hover-media-feature',
    'postcss-simple-vars',
    'postcss-hexrgba',
    'postcss-nested',
    'postcss-nested-ancestors',
    'autoprefixer',
  ]

  if (isProd) {
    const pxtoremPlugin = [
      'postcss-pxtorem',
      {
        rootValue: 16,
        propList: ['*'],
        selectorBlackList: [/^html$/],
        exclude: /node_modules/i
      }
    ]

    postcssPlugins.push(pxtoremPlugin)
  }

  const baseCssLoader = isProd
    ?  MiniCssExtractPlugin.loader
    : 'style-loader'

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: postcssPlugins
      }
    }
  }

  return {
    devServer: {
      static: {
        directory: getPath('./public')
      },
      compress: false,
      port: 1113
    },
    resolve: {
      alias: {
        '@': getPath('./src')
      },
      extensions: ['.tsx', '.ts', '.js'],
      modules: ['./node_modules']
    },
    entry,
    output: {
      path: getPath('./public/dist'),
      filename: 'assets/js/[name].bundle.js'
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
        new CssMinimizerPlugin({
          minify: [
            CssMinimizerPlugin.cssnanoMinify,
            CssMinimizerPlugin.cleanCssMinify,
          ]
        })
      ]
    },
    module: {
      rules: [
        // JS
        // {
        //   test: /\.(js)$/,
        //   exclude: /node_modules/,
        //   use: {
        //     loader: 'babel-loader',
        //     options: {
        //       presets: [ '@babel/preset-env' ]
        //     }
        //   }
        // },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.html$/i,
          exclude: /(pages)/,
          use: {
            loader: 'html-loader',
            options: {
              sources: false
            }
          }
        },
        // Обычный CSS
        {
          test: /\.css$/i,
          exclude: path.resolve(__dirname, './src/components'),
          use: [
            baseCssLoader,
            'css-loader',
            postcssLoader,
          ]
        },
        // Импортируемый CSS для веб-компонентов
        {
          test: /\.css$/i,
          exclude: /(styles|node_modules)/,
          use: [
            {
              loader: 'css-loader',
              options: {
                exportType: 'string',
              },
            },
            postcssLoader,
          ]
        },
        // Шрифты
        {
          test: /\.(woff|svg|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          include: /(fonts)/,
          generator: {
            filename: 'fonts/[name][ext]'
          }
        },
        {
          test: /\.svg/,
          exclude: /(fonts)/,
          type: 'asset/inline',
        },
      ]
    },
    plugins: [
      ...routeInstances,
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].bundle.css'
      })
    ]
  }
}
