"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpackFinal = webpackFinal;
exports.managerWebpack = managerWebpack;
exports.babelDefault = babelDefault;

var _path = _interopRequireDefault(require("path"));

var _nodeLogger = require("@storybook/node-logger");

var _craConfig = require("./cra-config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Disable the built-in preset if the new preset is detected.
const checkForNewPreset = presetsList => {
  const hasNewPreset = presetsList.some(preset => {
    const presetName = typeof preset === 'string' ? preset : preset.name;
    return presetName === '@storybook/preset-create-react-app';
  });

  if (!hasNewPreset) {
    _nodeLogger.logger.warn('Storybook support for Create React App is now a separate preset.');

    _nodeLogger.logger.warn('To get started with the new preset, simply add `@storybook/preset-create-react-app` to your project.');

    _nodeLogger.logger.warn('The built-in preset will be disabled in Storybook 6.0.');

    return false;
  }

  return true;
};

function webpackFinal(config, {
  presetsList,
  configDir
}) {
  if (!(0, _craConfig.isReactScriptsInstalled)()) {
    _nodeLogger.logger.info('=> Using base config because react-scripts is not installed.');

    return config;
  }

  if (checkForNewPreset(presetsList)) {
    return config;
  }

  _nodeLogger.logger.info('=> Loading create-react-app config.');

  return (0, _craConfig.applyCRAWebpackConfig)(config, configDir);
}

function managerWebpack(config, {
  presetsList
}) {
  if (!(0, _craConfig.isReactScriptsInstalled)() || checkForNewPreset(presetsList)) {
    return config;
  }

  return _objectSpread({}, config, {
    resolveLoader: {
      modules: ['node_modules', _path.default.join((0, _craConfig.getReactScriptsPath)(), 'node_modules')]
    }
  });
}

function babelDefault(config, {
  presetsList
}) {
  if (!(0, _craConfig.isReactScriptsInstalled)() || checkForNewPreset(presetsList)) {
    return config;
  }

  return _objectSpread({}, config, {
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [[require.resolve('babel-plugin-named-asset-import'), {
      loaderMap: {
        svg: {
          ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'
        }
      }
    }]]
  });
}