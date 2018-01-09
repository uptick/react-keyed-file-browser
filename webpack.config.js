var path = require('path');

module.exports = {
  entry: './demos.js',
  output: {
    path: __dirname + '/dist',
    filename: 'demos.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: [
            'env',
            'react',
            'stage-0',
          ],
        },
      },
    ],
  },
};
