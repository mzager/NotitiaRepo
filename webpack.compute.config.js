// Run the folllowing to recompile JS
// npm run worker
// const MyWorker = require('file-loader?name=worker.[hash:20].[ext]!../assets/compute.js');
const config = {
  mode: 'development',
  entry: './src/compute.ts',
  output: {
    filename: './src/assets/compute.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  performance: {
    hints: false
  }
};

module.exports = config;