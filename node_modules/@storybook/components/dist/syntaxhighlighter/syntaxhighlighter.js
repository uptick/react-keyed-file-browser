"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.trim");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.timers");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntaxHighlighter = void 0;

var _react = _interopRequireWildcard(require("react"));

var _theming = require("@storybook/theming");

var _global = require("global");

var _memoizerific = _interopRequireDefault(require("memoizerific"));

var _jsx = _interopRequireDefault(require("react-syntax-highlighter/dist/cjs/languages/prism/jsx"));

var _bash = _interopRequireDefault(require("react-syntax-highlighter/dist/cjs/languages/prism/bash"));

var _css = _interopRequireDefault(require("react-syntax-highlighter/dist/cjs/languages/prism/css"));

var _markup = _interopRequireDefault(require("react-syntax-highlighter/dist/cjs/languages/prism/markup"));

var _tsx = _interopRequireDefault(require("react-syntax-highlighter/dist/cjs/languages/prism/tsx"));

var _typescript = _interopRequireDefault(require("react-syntax-highlighter/dist/cjs/languages/prism/typescript"));

var _reactSyntaxHighlighter = require("react-syntax-highlighter");

var _ActionBar = require("../ActionBar/ActionBar");

var _ScrollArea = require("../ScrollArea/ScrollArea");

var _formatter = require("./formatter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

_reactSyntaxHighlighter.PrismLight.registerLanguage('jsx', _jsx["default"]);

_reactSyntaxHighlighter.PrismLight.registerLanguage('bash', _bash["default"]);

_reactSyntaxHighlighter.PrismLight.registerLanguage('css', _css["default"]);

_reactSyntaxHighlighter.PrismLight.registerLanguage('html', _markup["default"]);

_reactSyntaxHighlighter.PrismLight.registerLanguage('tsx', _tsx["default"]);

_reactSyntaxHighlighter.PrismLight.registerLanguage('typescript', _typescript["default"]);

var themedSyntax = (0, _memoizerific["default"])(2)(function (theme) {
  return Object.entries(theme.code || {}).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    return Object.assign({}, acc, _defineProperty({}, "* .".concat(key), val));
  }, {});
});

var Wrapper = _theming.styled.div(function (_ref3) {
  var theme = _ref3.theme;
  return {
    position: 'relative',
    overflow: 'hidden',
    color: theme.color.defaultText
  };
}, function (_ref4) {
  var theme = _ref4.theme,
      bordered = _ref4.bordered;
  return bordered ? {
    border: "1px solid ".concat(theme.appBorderColor),
    borderRadius: theme.borderRadius,
    background: theme.background.content
  } : {};
});

var Scroller = (0, _theming.styled)(function (_ref5) {
  var children = _ref5.children,
      className = _ref5.className;
  return _react["default"].createElement(_ScrollArea.ScrollArea, {
    horizontal: true,
    vertical: true,
    className: className
  }, children);
})({
  position: 'relative'
}, function (_ref6) {
  var theme = _ref6.theme;
  return {
    '& code': {
      paddingRight: theme.layoutMargin
    }
  };
}, function (_ref7) {
  var theme = _ref7.theme;
  return themedSyntax(theme);
});

var Pre = _theming.styled.pre(function (_ref8) {
  var theme = _ref8.theme,
      padded = _ref8.padded;
  return {
    display: 'flex',
    justifyContent: 'flex-start',
    margin: 0,
    padding: padded ? theme.layoutMargin : 0
  };
});

var Code = _theming.styled.code({
  flex: 1,
  paddingRight: 0,
  opacity: 1
});

var SyntaxHighlighter = function SyntaxHighlighter(_ref9) {
  var children = _ref9.children,
      _ref9$language = _ref9.language,
      language = _ref9$language === void 0 ? 'jsx' : _ref9$language,
      _ref9$copyable = _ref9.copyable,
      copyable = _ref9$copyable === void 0 ? false : _ref9$copyable,
      _ref9$bordered = _ref9.bordered,
      bordered = _ref9$bordered === void 0 ? false : _ref9$bordered,
      _ref9$padded = _ref9.padded,
      padded = _ref9$padded === void 0 ? false : _ref9$padded,
      _ref9$format = _ref9.format,
      format = _ref9$format === void 0 ? true : _ref9$format,
      _ref9$className = _ref9.className,
      className = _ref9$className === void 0 ? null : _ref9$className,
      rest = _objectWithoutProperties(_ref9, ["children", "language", "copyable", "bordered", "padded", "format", "className"]);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      copied = _useState2[0],
      setCopied = _useState2[1];

  var onClick = function onClick(e) {
    e.preventDefault();

    var tmp = _global.document.createElement('TEXTAREA');

    var focus = _global.document.activeElement;
    tmp.value = children;

    _global.document.body.appendChild(tmp);

    tmp.select();

    _global.document.execCommand('copy');

    _global.document.body.removeChild(tmp);

    focus.focus();
    setCopied(true);

    _global.window.setTimeout(function () {
      return setCopied(false);
    }, 1500);
  };

  return children ? _react["default"].createElement(Wrapper, {
    bordered: bordered,
    padded: padded,
    className: className
  }, _react["default"].createElement(Scroller, null, _react["default"].createElement(_reactSyntaxHighlighter.PrismLight, _extends({
    padded: padded || bordered,
    language: language,
    useInlineStyles: false,
    PreTag: Pre,
    CodeTag: Code,
    lineNumberContainerStyle: {}
  }, rest), format ? (0, _formatter.formatter)(children.trim()) : children.trim())), copyable ? _react["default"].createElement(_ActionBar.ActionBar, {
    actionItems: [{
      title: copied ? 'Copied' : 'Copy',
      onClick: onClick
    }]
  }) : null) : null;
};

exports.SyntaxHighlighter = SyntaxHighlighter;