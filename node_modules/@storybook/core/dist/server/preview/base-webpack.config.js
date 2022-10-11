"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultWebpackConfig = createDefaultWebpackConfig;

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

var _findUp = _interopRequireDefault(require("find-up"));

var _path = _interopRequireDefault(require("path"));

var _nodeLogger = require("@storybook/node-logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function createDefaultWebpackConfig(storybookBaseConfig, options) {
  if (options.presetsList.some(({
    name
  }) => name === '@storybook/preset-create-react-app')) {
    return storybookBaseConfig;
  }

  const postcssConfigFiles = ['.postcssrc', '.postcssrc.json', '.postcssrc.yml', '.postcssrc.js', 'postcss.config.js'];
  const customPostcssConfig = await (0, _findUp.default)(postcssConfigFiles);
  let postcssOptions = {};

  if (customPostcssConfig) {
    _nodeLogger.logger.info(`=> Using custom ${_path.default.basename(customPostcssConfig)}`);

    postcssOptions = {
      config: {
        path: _path.default.dirname(customPostcssConfig)
      }
    };
  } else {
    postcssOptions = {
      ident: 'postcss',
      postcss: {},
      plugins: () => [require('postcss-flexbugs-fixes'), // eslint-disable-line global-require
      (0, _autoprefixer.default)({
        flexbox: 'no-2009'
      })]
    };
  }

  return _objectSpread({}, storybookBaseConfig, {
    module: _objectSpread({}, storybookBaseConfig.module, {
      rules: [...storybookBaseConfig.module.rules, {
        test: /\.css$/,
        sideEffects: true,
        use: [require.resolve('style-loader'), {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1
          }
        }, {
          loader: require.resolve('postcss-loader'),
          options: postcssOptions
        }]
      }, {
        test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }, {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }]
    })
  });
}