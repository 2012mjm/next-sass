const cssLoaderConfig = require('@zeit/next-css/css-loader-config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        );
      }

      const { dev, isServer } = options;

      const {
        cssLoaderOptions,
        postcssLoaderOptions,
        sassLoaderOptions = {},
        cssExtractOutput = {
          filename: { dev: null, prod: null },
          chunkFilename: { dev: null, prod: null }
        }
      } = nextConfig;

      options.defaultLoaders.sass = cssModules =>
        cssLoaderConfig(config, {
          extensions: ['scss', 'sass'],
          cssModules,
          cssLoaderOptions,
          postcssLoaderOptions,
          dev,
          isServer,
          loaders: [
            {
              loader: 'sass-loader',
              options: sassLoaderOptions
            }
          ]
        });

      config.module.rules.push(
        {
          test: /\.(scss|sass)$/,
          exclude: /\.module\.(scss|sass)$/,
          use: Object.assign(options.defaultLoaders.sass(false), {
            loader: ExtractCssChunks.loader,
            options: {
              hot: true,
              reloadAll: true
            }
          })
        },
        {
          test: /\.module\.(scss|sass)$/,
          use: Object.assign(options.defaultLoaders.sass(true), {
            loader: ExtractCssChunks.loader,
            options: {
              hot: true,
              reloadAll: true
            }
          })
        }
      );

      if (!isServer) {
        config.plugins.forEach(function(plugin, index) {
          if (plugin instanceof MiniCssExtractPlugin)
            config.plugins.splice(index, 1);
        });

        var miniCssExtractPlugin = {
          filename: dev
            ? 'static/css/[name].css'
            : 'static/css/[name].[contenthash:8].css',
          chunkFilename: dev
            ? 'static/css/[name].chunk.css'
            : 'static/css/[name].[contenthash:8].chunk.css'
        };

        if (cssExtractOutput.filename[dev ? 'dev' : 'prod']) {
          miniCssExtractPlugin.filename =
            cssExtractOutput.filename[dev ? 'dev' : 'prod'];
        }
        if (cssExtractOutput.chunkFilename[dev ? 'dev' : 'prod']) {
          miniCssExtractPlugin.chunkFilename =
            cssExtractOutput.chunkFilename[dev ? 'dev' : 'prod'];
        }

        config.plugins.push(new MiniCssExtractPlugin(miniCssExtractPlugin));
      }

      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            styles: {
              test: /\.+(scss|sass)$/,
              name: 'styles',
              chunks: 'all',
              minChunks: 2,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
};
