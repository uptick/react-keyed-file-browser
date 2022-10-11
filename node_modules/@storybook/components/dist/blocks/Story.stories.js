"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reactHook = exports.error = exports.inline = exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Story = require("./Story");

var _Button = require("../Button/Button");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = {
  title: 'Docs/Story',
  component: _Story.Story
};
exports["default"] = _default;

var _ref =
/*#__PURE__*/
_react["default"].createElement(_Button.Button, {
  secondary: true
}, "Inline story");

var buttonFn = function buttonFn() {
  return _ref;
};

buttonFn.displayName = "buttonFn";

var buttonHookFn = function buttonHookFn() {
  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      count = _useState2[0],
      setCount = _useState2[1];

  return _react["default"].createElement(_Button.Button, {
    secondary: true,
    onClick: function onClick() {
      return setCount(count + 1);
    }
  }, "count: ".concat(count));
};

buttonHookFn.displayName = "buttonHookFn";

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_Story.Story, {
  inline: true,
  storyFn: buttonFn,
  title: "hello button"
});

var inline = function inline() {
  return _ref2;
};

exports.inline = inline;
inline.displayName = "inline";

var error = function error() {
  return _react["default"].createElement(_Story.Story, {
    error: _Story.StoryError.NO_STORY
  });
};

exports.error = error;
error.displayName = "error";

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_Story.Story, {
  inline: true,
  storyFn: buttonHookFn,
  title: "hello button"
});

var reactHook = function reactHook() {
  return _ref3;
};

exports.reactHook = reactHook;
reactHook.displayName = "reactHook";