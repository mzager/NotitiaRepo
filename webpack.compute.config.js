// Run the folllowing to recompile JS
// npm run worker
// const MyWorker = require('file-loader?name=worker.[hash:20].[ext]!../assets/compute.js');
const config = {
  mode: 'development',
  entry: './src/compute.ts',
  output: {
    filename: 'compute.js',
    path: __dirname + '/src/assets'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js']
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