const path = require("path")

module.exports = {
  stories: ['../stories/index.js'],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'none',
  },
  webpackFinal: (config) => {
    config.resolve.alias['@module/constants'] = path.resolve(__dirname, '../src/constants')
    config.resolve.alias['@module/sorters'] = path.resolve(__dirname, '../src/sorters')
    config.resolve.alias['@module/utils'] = path.resolve(__dirname, '../src/utils')

    config.module.rules.push({
      test: /\.(sass|scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: [
          path.resolve(__dirname, '../stories')
      ]
    })
    config.resolve.extensions.push('.sass')
    return config
  }
}
