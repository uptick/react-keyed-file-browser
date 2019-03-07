module.exports = {
  entry: './demos.js',
  output: {
    path: __dirname + '/dist',
    filename: 'demos.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          rootMode: 'upward',
        },
      },
    ],
  },
}
