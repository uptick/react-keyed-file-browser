"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropValue = void 0;

var _react = _interopRequireWildcard(require("react"));

var _lodash = require("lodash");

var _theming = require("@storybook/theming");

var _memoizerific = _interopRequireDefault(require("memoizerific"));

var _WithTooltip = require("../../tooltip/WithTooltip");

var _icon = require("../../icon/icon");

var _syntaxhighlighter = require("../../syntaxhighlighter/syntaxhighlighter");

var _shared = require("../../typography/shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Text = _theming.styled.span(function (_ref) {
  var theme = _ref.theme;
  return {
    fontFamily: theme.typography.fonts.mono,
    fontSize: theme.typography.size.s2 - 1
  };
});

var Expandable = _theming.styled.div(_shared.codeCommon, function (_ref2) {
  var theme = _ref2.theme;
  return {
    fontFamily: theme.typography.fonts.mono,
    color: theme.color.secondary,
    margin: 0,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center'
  };
});

var Detail = _theming.styled.div(function (_ref3) {
  var theme = _ref3.theme,
      width = _ref3.width;
  return {
    width: width,
    minWidth: 200,
    maxWidth: 800,
    padding: 15,
    // Dont remove the mono fontFamily here even if it seem useless, this is used by the browser to calculate the length of a "ch" unit.
    fontFamily: theme.typography.fonts.mono,
    fontSize: theme.typography.size.s2 - 1,
    // Most custom stylesheet will reset the box-sizing to "border-box" and will break the tooltip.
    boxSizing: 'content-box',
    '& code': {
      padding: '0 !important'
    }
  };
});

var ArrowIcon = (0, _theming.styled)(_icon.Icons)({
  height: 10,
  width: 10,
  minWidth: 10,
  marginLeft: 4
});

var _ref4 =
/*#__PURE__*/
_react["default"].createElement("span", null, "-");

var EmptyProp = function EmptyProp() {
  return _ref4;
};

EmptyProp.displayName = "EmptyProp";

var PropText = function PropText(_ref5) {
  var text = _ref5.text;
  return _react["default"].createElement(Text, null, text);
};

PropText.displayName = "PropText";
var calculateDetailWidth = (0, _memoizerific["default"])(1000)(function (detail) {
  var lines = detail.split(/\r?\n/);
  return "".concat(Math.max.apply(Math, _toConsumableArray(lines.map(function (x) {
    return x.length;
  }))), "ch");
});

var PropSummary = function PropSummary(_ref6) {
  var value = _ref6.value;
  var summary = value.summary,
      detail = value.detail;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1]; // summary is used for the default value
  // below check fixes not displaying default values for boolean typescript vars


  var summaryAsString = summary !== undefined && summary !== null && typeof summary.toString === 'function' ? summary.toString() : summary;

  if ((0, _lodash.isNil)(detail)) {
    return _react["default"].createElement(PropText, {
      text: summaryAsString
    });
  }

  return _react["default"].createElement(_WithTooltip.WithTooltipPure, {
    closeOnClick: true,
    trigger: "click",
    placement: "bottom",
    tooltipShown: isOpen,
    onVisibilityChange: function onVisibilityChange(isVisible) {
      setIsOpen(isVisible);
    },
    tooltip: _react["default"].createElement(Detail, {
      width: calculateDetailWidth(detail)
    }, _react["default"].createElement(_syntaxhighlighter.SyntaxHighlighter, {
      language: "jsx",
      format: false
    }, detail))
  }, _react["default"].createElement(Expandable, {
    className: "sbdocs-expandable"
  }, _react["default"].createElement("span", null, summaryAsString), _react["default"].createElement(ArrowIcon, {
    icon: isOpen ? 'arrowup' : 'arrowdown'
  })));
};

PropSummary.displayName = "PropSummary";

var _ref8 =
/*#__PURE__*/
_react["default"].createElement(EmptyProp, null);

var PropValue = function PropValue(_ref7) {
  var value = _ref7.value;
  return (0, _lodash.isNil)(value) ? _ref8 : _react["default"].createElement(PropSummary, {
    value: value
  });
};

exports.PropValue = PropValue;