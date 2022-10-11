"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadCustomPresets;

var _path = _interopRequireDefault(require("path"));

var _tsDedent = _interopRequireDefault(require("ts-dedent"));

var _serverRequire = _interopRequireDefault(require("../utils/server-require"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadCustomPresets({
  configDir
}) {
  const presets = (0, _serverRequire.default)(_path.default.resolve(configDir, 'presets'));
  const main = (0, _serverRequire.default)(_path.default.resolve(configDir, 'main'));

  if (presets && main) {
    throw new Error((0, _tsDedent.default)`
      You have both a "main.js" and a "presets.js", remove the "presets.js" file from your configDir (${_path.default.resolve(configDir, 'presets')})`);
  }

  if (main) {
    return [_path.default.resolve(configDir, 'main')];
  }

  return presets || [];
}