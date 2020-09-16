const path = require('path')
const NodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'react-keyed-file-browser.js',
    library: 'react-keyed-file-browser',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: [require.resolve('babel-loader')],
        include: path.join(__dirname, './src/'),
      },
      {
        test: /.*\.sass*/,
        loader: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('sass-loader')],
        include: path.join(__dirname, '/src'),
      },
    ],
  },
  externals: NodeExternals(),
}
