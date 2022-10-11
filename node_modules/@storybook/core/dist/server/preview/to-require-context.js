"use strict";

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toRequireContextString = exports.toRequireContext = void 0;

var _globBase = _interopRequireDefault(require("glob-base"));

var _micromatch = require("micromatch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false;

const toRequireContext = input => {
  switch (true) {
    case typeof input === 'string':
      {
        const {
          base,
          glob
        } = (0, _globBase.default)(input);
        const regex = (0, _micromatch.makeRe)(glob).toString() // webpack prepends the relative path with './'
        .replace(/^\/\^/, '/^\\.\\/').replace(/\?:\^/g, '?:');
        return {
          path: base,
          recursive: glob.startsWith('**'),
          match: regex
        };
      }

    case isObject(input):
      {
        return input;
      }

    default:
      {
        throw new Error('the provided input cannot be transformed into a require.context');
      }
  }
};

exports.toRequireContext = toRequireContext;

const toRequireContextString = input => {
  const {
    path: p,
    recursive: r,
    match: m
  } = toRequireContext(input);
  return `require.context('${p}', ${r}, ${m})`;
};

exports.toRequireContextString = toRequireContextString;