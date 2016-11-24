var path = require('path');

module.exports = {
  entry: './demos.jsx',
  output: {
    path: __dirname + '/dist',
    filename: 'demos.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: [
            'react',
            'es2015',
            'stage-0',
          ],
        },
      },
    ],
  },
};
