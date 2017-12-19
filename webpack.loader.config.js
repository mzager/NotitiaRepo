// Run the folllowing to recompile JS
// npm run worker
// const MyWorker = require('file-loader?name=worker.[hash:20].[ext]!../assets/compute.js');
const config = {
  entry: './src/loader.ts',
  output: {
    filename: './src/assets/loader.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {test: /\.tsx?$/, loader: 'ts-loader'}
    ]
  }
};

module.exports = config;