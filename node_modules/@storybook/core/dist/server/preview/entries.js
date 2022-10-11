"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPreviewEntry = createPreviewEntry;

var _path = _interopRequireDefault(require("path"));

var _nodeLogger = require("@storybook/node-logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createPreviewEntry(options) {
  const {
    configDir,
    presets
  } = options;
  const entries = [require.resolve('../common/polyfills'), require.resolve('./globals')];
  const configs = await presets.apply('config', [], options);
  const stories = await presets.apply('stories', [], options);

  if (configs && configs.length) {
    _nodeLogger.logger.info(`=> Loading config/preview file in "${configDir}".`);

    entries.push(...configs);
  }

  if (stories && stories.length) {
    _nodeLogger.logger.info(`=> Adding stories defined in "${_path.default.join(configDir, 'main.js')}".`);

    entries.push(_path.default.resolve(_path.default.join(configDir, `generated-entry.js`)));
  }

  return entries;
}