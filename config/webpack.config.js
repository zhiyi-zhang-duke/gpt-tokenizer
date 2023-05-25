'use strict';

const { merge } = require('webpack-merge');
const path = require('path'); // import path module if it is not already done

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      contentScript: PATHS.src + '/contentScript.js',
      background: PATHS.src + '/background.js',
      'gpt-tokenizer': './node_modules/gpt-tokenizer/dist/cl100k_base.js', // Update the path to gpt-tokenizer
    },    
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
      sourceMapFilename: '[file].map' // Changed from [name].js.map to [file].map to avoid filename conflict
    },    
    devtool: argv.mode === 'production' ? false : 'source-map',
    resolve: {
      modules: ['./src', './node_modules'],
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
      },
    }    
  });

module.exports = config;
