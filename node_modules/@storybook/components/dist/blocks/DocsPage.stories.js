"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markdown = exports.text = exports.noText = exports.empty = exports.withSubtitle = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _DocsPage = require("./DocsPage");

var storyStories = _interopRequireWildcard(require("./Story.stories"));

var previewStories = _interopRequireWildcard(require("./Preview.stories"));

var propsTableStories = _interopRequireWildcard(require("./PropsTable/PropsTable.stories"));

var sourceStories = _interopRequireWildcard(require("./Source.stories"));

var descriptionStories = _interopRequireWildcard(require("./Description.stories"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'Docs/DocsPage',
  component: _DocsPage.DocsWrapper,
  decorators: [function (storyFn) {
    return _react["default"].createElement(_DocsPage.DocsWrapper, null, _react["default"].createElement(_DocsPage.DocsContent, null, storyFn()));
  }]
};
exports["default"] = _default;

var _ref =
/*#__PURE__*/
_react["default"].createElement(_DocsPage.Title, null, "DocsPage");

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_DocsPage.Subtitle, null, "What the DocsPage looks like. Meant to be QAed in Canvas tab not in Docs tab.");

var withSubtitle = function withSubtitle() {
  return _react["default"].createElement(_react["default"].Fragment, null, _ref, _ref2, descriptionStories.text(), previewStories.single(), propsTableStories.normal(), sourceStories.jsx());
};

exports.withSubtitle = withSubtitle;
withSubtitle.story = {
  name: 'with subtitle'
};

var empty = function empty() {
  return _react["default"].createElement(_react["default"].Fragment, null, storyStories.error(), propsTableStories.error(), sourceStories.sourceUnavailable());
};

exports.empty = empty;

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_DocsPage.Title, null, "no text");

var noText = function noText() {
  return _react["default"].createElement(_react["default"].Fragment, null, _ref3, previewStories.single(), propsTableStories.normal(), sourceStories.jsx());
};

exports.noText = noText;
noText.story = {
  name: 'no text'
};

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_DocsPage.Title, null, "Sensorium");

var text = function text() {
  return _react["default"].createElement(_react["default"].Fragment, null, _ref4, descriptionStories.text(), previewStories.single(), propsTableStories.normal(), sourceStories.jsx());
};

exports.text = text;

var _ref5 =
/*#__PURE__*/
_react["default"].createElement(_DocsPage.Title, null, "markdown");

var markdown = function markdown() {
  return _react["default"].createElement(_react["default"].Fragment, null, _ref5, descriptionStories.markdown(), previewStories.single(), propsTableStories.normal(), sourceStories.jsx());
};

exports.markdown = markdown;