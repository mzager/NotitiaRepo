// Run the folllowing to recompile JS
// npm run worker
// const MyWorker = require('file-loader?name=worker.[hash:20].[ext]!../assets/compute.js');
const config = {
  mode: 'production',
  entry: './src/loader.ts',
  output: {
    filename: 'loader.js',
    path: __dirname + '/src/assets'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};

module.exports = config;