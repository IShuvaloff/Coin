/* eslint-disable no-undef */
const HtmlWebpackPlugin = require('html-webpack-plugin'); // ! для взятия src/index.html в качестве шаблона создания результирующего
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // ! для извлечения стилей css из общего js-бандла в отдельный файл .css
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin'); // ! для оптимизации изображений
// const FileManagerPlugin = require('filemanager-webpack-plugin'); // ! для удаления файлов при пересборке и копирования файлов при сборке
const path = require('path'); // ! глобальный системный путь к корневой папке (может различаться между разными ОС)

module.exports = (env) => ({
  // ! используем параметр env для того, чтобы запускать различные плагины в зависимости от версии сборки
  entry: [
    path.join(__dirname, 'src', 'main.js'),
    // path.join(__dirname, 'src', 'main.sass'), // ! можно здесь, но лучше импортировать все нужные файлы внутрь главного entry-файла main.js
  ], // ! источник входных файлов .js и других
  output: {
    filename: 'main.[contenthash].js', // ! результирующий файл в папку dist/main.js
    publicPath: '/',
    clean: true, // ! очистить папку перед сборкой
    assetModuleFilename: path.join('assets', '[name].[contenthash][ext]'), // ! общее место сохранения файлов (если для типа файла не назначен generator)
  },
  module: {
    rules: [
      {
        // ! загрузка графических файлов
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('img', '[name].[contenthash][ext]'),
        },
      },
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('icons', '[name].[contenthash][ext]'), // ! изменить папку и имя файла для .svg-картинок
        },
      },
      {
        test: /\.s[ac]ss$/i, // ! только файлы .sass, причем в конце имени
        use: [
          // 'style-loader', // #4... (Creates `style` nodes from JS strings)
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader', // ! #4... (создает минифицированный блок стилей в отдельном файле .css для development)
          'css-loader', // ! #3... (Translates CSS into CommonJS)
          'postcss-loader', // ! #2... (добавляет пост-обработку для разных браузеров)
          'sass-loader', // ! #1 в очереди (Compiles Sass to CSS)
        ],
      },
      {
        // ! загрузка шрифтов
        test: /\.(woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('fonts', '[name].[contenthash][ext]'),
        },
      },
      {
        test: /\.js$/, // ! преобразует код файлов .js в приемлемый для старых браузеров формат
        use: 'babel-loader',
        exclude: /node_modules/, // ! не применять правило для файлов из /node_modules
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'), // ! исходный файл
      filename: 'index.html', // ! результирующий файл
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // ! минификация и создание отдельного файла .css (указано результирующее имя)
    }),
    // new FileManagerPlugin({ // ! конкретные указания по простейшему перемещению к-л файлов
    //   events: {
    //     onStart: {
    //       // ! удалить папку dist перед каждой сборкой
    //       delete: [path.join('dist')],
    //     },
    //     onEnd: {
    //       // ! при окончании сборки скопировать требуемые файлы из папки src/fonts в папку dist/fonts
    //       copy: [
    //         {
    //           source: path.join('src', 'assets', 'fonts'),
    //           destination: 'dist/fonts',
    //         },
    //       ],
    //     },
    //   },
    // }),
  ],
  devServer: {
    watchFiles: path.join(__dirname, 'src'), // ! наблюдатель за изменениями для авто-релодинга
    port: 9000,
    hot: true,
    historyApiFallback: true,
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        // ! оптимизация изображений через image-minimizer-plugin
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', { name: 'preset-default' }],
            ],
          },
        },
      }),
    ],
  },
});
