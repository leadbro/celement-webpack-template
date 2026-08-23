/// <reference path="./src/types/webpack-vendors.d.ts" />
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import postcssGlobalData from '@csstools/postcss-global-data'
import type { Configuration } from 'webpack'
import 'webpack-dev-server'

import routes from './src/routes'

const getPath = (p: string) => path.resolve(__dirname, p)

const routeInstances = routes.map(route => {
  const template = getPath(`./src/pages/${route.filename}`)
  const params = { ...route, template }
  return new HtmlWebpackPlugin(params)
})

export default (_env: unknown, options: { mode: string }): Configuration => {
  const { mode } = options

  const isProd = mode === 'production'

  const entry = isProd
    ? { // Для продакшена
      base: [
        getPath('./src/entries/base.ts')
      ],
      styles: [
        getPath('./src/assets/styles/entries/root.ts'),
        getPath('./src/assets/styles/common/fonts.css'),
        getPath('./src/assets/styles/entries/top.ts'),
        getPath('./src/assets/styles/entries/common.ts'),
        getPath('./src/assets/styles/entries/ui.ts'),
        getPath('./src/assets/styles/entries/base.ts'),
      ]
    }
    : [ // Для hot-reload
      getPath('./src/assets/styles/common/fonts.css'),
      getPath('./src/assets/styles/entries/root.ts'),
      getPath('./src/entries/base.ts'),
      getPath('./src/assets/styles/entries/top.ts'),
      getPath('./src/assets/styles/entries/common.ts'),
      getPath('./src/assets/styles/entries/ui.ts'),
      getPath('./src/assets/styles/entries/base.ts'),
    ]

  const postcssPlugins: unknown[] = [
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
    postcssPlugins.push([
      'postcss-pxtorem',
      {
        rootValue: 16,
        propList: ['*'],
        selectorBlackList: [/^html$/],
        exclude: /node_modules/i
      }
    ])
  }

  const baseCssLoader = isProd
    ? MiniCssExtractPlugin.loader
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new CssMinimizerPlugin({
          minify: [
            CssMinimizerPlugin.cssnanoMinify,
            CssMinimizerPlugin.cleanCssMinify,
          ] as any,
        }),
      ]
    },
    module: {
      rules: [
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
