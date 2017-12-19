// Run the folllowing to recompile JS
// npm run worker
// const MyWorker = require('file-loader?name=worker.[hash:20].[ext]!../assets/compute.js');
const config = {
  entry: './src/compute.ts',
  output: {
    filename: './src/assets/compute.js'
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