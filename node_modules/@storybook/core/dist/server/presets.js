"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.splitAddons = exports.resolveAddonName = void 0;

var _tsDedent = _interopRequireDefault(require("ts-dedent"));

var _path = require("path");

var _nodeLogger = require("@storybook/node-logger");

var _fs = _interopRequireDefault(require("fs"));

var _resolveFile = require("./utils/resolve-file");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false;

const isFunction = val => typeof val === 'function'; // Copied out of parse-package-name
//  '@storybook/addon-actions/register' => ( name: '@storybook/addon-actions', path: '/register', version: '' )


const RE_SCOPED = /^(@[^/]+\/[^/@]+)(?:\/([^@]+))?(?:@([\s\S]+))?/;
const RE_NORMAL = /^([^/@]+)(?:\/([^@]+))?(?:@([\s\S]+))?/;

function parsePackageName(input) {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  const matched = input.startsWith('@') ? input.match(RE_SCOPED) : input.match(RE_NORMAL);

  if (!matched) {
    throw new Error(`[parse-package-name] "${input}" is not a valid string`);
  }

  return {
    name: matched[1],
    path: matched[2] || '',
    version: matched[3] || ''
  };
}

const resolvePresetFunction = (input, presetOptions, storybookOptions) => {
  if (isFunction(input)) {
    return input(_objectSpread({}, storybookOptions, {}, presetOptions));
  }

  if (Array.isArray(input)) {
    return input;
  }

  return [];
};

const isLocalFileImport = packageName => _fs.default.existsSync(packageName);
/**
 * Parse an addon into either a managerEntry or a preset. Throw on invalid input.
 *
 * Valid inputs:
 * - '@storybook/addon-actions/register'
 *   =>  { type: 'managerEntries', item }
 *
 * - '@storybook/addon-docs/preset'
 *   =>  { type: 'presets', item }
 *
 * - '@storybook/addon-docs'
 *   =>  { type: 'presets', item: '@storybook/addon-docs/preset' }
 *
 * - { name: '@storybook/addon-docs(/preset)?', options: { ... } }
 *   =>  { type: 'presets', item: { name: '@storybook/addon-docs/preset', options } }
 */


const resolveAddonName = name => {
  let path;

  if (isLocalFileImport(name)) {
    path = name;
  } else {
    ({
      path
    } = parsePackageName(name));
  } // when user provides full path, we don't need to do anything


  if (path) {
    return {
      name,
      // Accept `register`, `register.js`, `require.resolve('foo/register'), `register-panel`
      type: path.match(/register(-panel)?(.js)?$/) ? 'managerEntries' : 'presets'
    };
  }

  try {
    return {
      name: (0, _resolveFile.resolveFile)((0, _path.join)(name, 'preset')),
      type: 'presets'
    }; // eslint-disable-next-line no-empty
  } catch (err) {}

  try {
    return {
      name: (0, _resolveFile.resolveFile)((0, _path.join)(name, 'register')),
      type: 'managerEntries'
    }; // eslint-disable-next-line no-empty
  } catch (err) {}

  return {
    name,
    type: 'presets'
  };
};

exports.resolveAddonName = resolveAddonName;

const splitAddons = addons => {
  return addons.reduce((acc, item) => {
    try {
      if (isObject(item)) {
        const {
          name
        } = resolveAddonName(item.name);
        acc.presets.push(_objectSpread({}, item, {
          name
        }));
      } else {
        const {
          name,
          type
        } = resolveAddonName(item);
        acc[type].push(name);
      }
    } catch (err) {
      _nodeLogger.logger.error(`Addon value should end in /register OR it should be a valid preset https://storybook.js.org/docs/presets/introduction/\n${item}`);
    }

    return acc;
  }, {
    managerEntries: [],
    presets: []
  });
};

exports.splitAddons = splitAddons;

function interopRequireDefault(filePath) {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const result = require(`${filePath}`);

  const isES6DefaultExported = typeof result === 'object' && result !== null && typeof result.default !== 'undefined';
  return isES6DefaultExported ? result.default : result;
}

function loadPreset(input, level, storybookOptions) {
  try {
    const name = input.name ? input.name : input;
    const presetOptions = input.options ? input.options : {};
    const contents = interopRequireDefault(name);

    if (Array.isArray(contents)) {
      const subPresets = contents;
      return loadPresets(subPresets, level + 1, storybookOptions);
    }

    if (isObject(contents)) {
      const {
        addons: addonsInput,
        presets: presetsInput
      } = contents,
            rest = _objectWithoutProperties(contents, ["addons", "presets"]);

      const subPresets = resolvePresetFunction(presetsInput, presetOptions, storybookOptions);
      const subAddons = resolvePresetFunction(addonsInput, presetOptions, storybookOptions);
      const {
        managerEntries,
        presets
      } = splitAddons(subAddons);
      return [...loadPresets([...subPresets, ...presets], level + 1, storybookOptions), {
        name: `${name}_additionalManagerEntries`,
        preset: {
          managerEntries
        }
      }, {
        name,
        preset: rest,
        options: presetOptions
      }];
    }

    throw new Error((0, _tsDedent.default)`
      ${input} is not a valid preset
    `);
  } catch (e) {
    const warning = level > 0 ? `  Failed to load preset: ${JSON.stringify(input)} on level ${level}` : `  Failed to load preset: ${JSON.stringify(input)}`;

    _nodeLogger.logger.warn(warning);

    _nodeLogger.logger.error(e);

    return [];
  }
}

function loadPresets(presets, level, storybookOptions) {
  if (!presets || !Array.isArray(presets) || !presets.length) {
    return [];
  }

  if (!level) {
    _nodeLogger.logger.info('=> Loading presets');
  }

  return presets.reduce((acc, preset) => {
    const loaded = loadPreset(preset, level, storybookOptions);
    return acc.concat(loaded);
  }, []);
}

function applyPresets(presets, extension, config, args) {
  const presetResult = new Promise(resolve => resolve(config));

  if (!presets.length) {
    return presetResult;
  }

  return presets.reduce((accumulationPromise, {
    preset,
    options
  }) => {
    const change = preset[extension];

    if (!change) {
      return accumulationPromise;
    }

    if (typeof change === 'function') {
      const extensionFn = change;
      const context = {
        extensionFn,
        preset,
        combinedOptions: _objectSpread({}, args, {}, options, {
          presetsList: presets
        })
      };
      return accumulationPromise.then(newConfig => context.extensionFn.call(context.preset, newConfig, context.combinedOptions));
    }

    return accumulationPromise.then(newConfig => {
      if (Array.isArray(newConfig) && Array.isArray(change)) {
        return [...newConfig, ...change];
      }

      if (isObject(newConfig) && isObject(change)) {
        return _objectSpread({}, newConfig, {}, change);
      }

      return change;
    });
  }, presetResult);
}

function getPresets(presets, storybookOptions) {
  const loadedPresets = loadPresets(presets, 0, storybookOptions);
  return {
    apply: async (extension, config, args = {}) => applyPresets(loadedPresets, extension, config, args)
  };
}

var _default = getPresets;
exports.default = _default;