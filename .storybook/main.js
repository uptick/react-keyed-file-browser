const path = require("path")

module.exports = {
  stories: ['../stories/index.stories.js'],

  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.(sass|scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: [
          path.resolve(__dirname, '../stories')
      ]
    })
    config.resolve.extensions.push('.sass')
    return config
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  core: {
    enableCrashReports: false,
  },

  docs: {
    autodocs: true
  }
}
