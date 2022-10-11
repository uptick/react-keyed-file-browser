"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.search");

require("core-js/modules/es.string.starts-with");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatch = exports.stringifyQuery = exports.queryFromLocation = exports.queryFromString = exports.parsePath = exports.storyNameFromExport = exports.sanitize = exports.parseKind = exports.toId = void 0;

var _qs = _interopRequireDefault(require("qs"));

var _memoizerific = _interopRequireDefault(require("memoizerific"));

var _utilDeprecate = _interopRequireDefault(require("util-deprecate"));

var csf = _interopRequireWildcard(require("@storybook/csf"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _toId$parseKind$sanit = {
  toId: (0, _utilDeprecate["default"])(csf.toId, "Router util 'toId' moved to '@storybook/csf'."),
  parseKind: (0, _utilDeprecate["default"])(csf.parseKind, "Router util 'parseKind' moved to '@storybook/csf'."),
  sanitize: (0, _utilDeprecate["default"])(csf.sanitize, "Router util 'sanitize' moved to '@storybook/csf'."),
  storyNameFromExport: (0, _utilDeprecate["default"])(csf.storyNameFromExport, "Router util 'storyNameFromExport' moved to '@storybook/csf'.")
},
    toId = _toId$parseKind$sanit.toId,
    parseKind = _toId$parseKind$sanit.parseKind,
    sanitize = _toId$parseKind$sanit.sanitize,
    storyNameFromExport = _toId$parseKind$sanit.storyNameFromExport;
exports.storyNameFromExport = storyNameFromExport;
exports.sanitize = sanitize;
exports.parseKind = parseKind;
exports.toId = toId;
var splitPathRegex = /\/([^/]+)\/([^/]+)?/;
var parsePath = (0, _memoizerific["default"])(1000)(function (path) {
  var result = {
    viewMode: undefined,
    storyId: undefined
  };

  if (path) {
    var _ref = path.toLowerCase().match(splitPathRegex) || [undefined, undefined, undefined],
        _ref2 = _slicedToArray(_ref, 3),
        viewMode = _ref2[1],
        storyId = _ref2[2];

    if (viewMode) {
      Object.assign(result, {
        viewMode: viewMode,
        storyId: storyId
      });
    }
  }

  return result;
});
exports.parsePath = parsePath;
var queryFromString = (0, _memoizerific["default"])(1000)(function (s) {
  return _qs["default"].parse(s, {
    ignoreQueryPrefix: true
  });
});
exports.queryFromString = queryFromString;

var queryFromLocation = function queryFromLocation(location) {
  return queryFromString(location.search);
};

exports.queryFromLocation = queryFromLocation;

var stringifyQuery = function stringifyQuery(query) {
  return _qs["default"].stringify(query, {
    addQueryPrefix: true,
    encode: false
  });
};

exports.stringifyQuery = stringifyQuery;
var getMatch = (0, _memoizerific["default"])(1000)(function (current, target) {
  var startsWith = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var startsWithTarget = current && startsWith && current.startsWith(target);
  var currentIsTarget = typeof target === 'string' && current === target;
  var matchTarget = current && target && current.match(target);

  if (startsWithTarget || currentIsTarget || matchTarget) {
    return {
      path: current
    };
  }

  return null;
});
exports.getMatch = getMatch;