"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withWeightText = exports.withFontFamily = exports.withFontWeight = exports.withFontSizes = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _Typeset = require("./Typeset");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'Docs/Typeset',
  component: _Typeset.Typeset
};
exports["default"] = _default;
var fontSizes = ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px'];
var fontWeight = 900;
var fontFamily = 'monospace';

var _ref =
/*#__PURE__*/
_react["default"].createElement(_Typeset.Typeset, {
  fontSizes: fontSizes
});

var withFontSizes = function withFontSizes() {
  return _ref;
};

exports.withFontSizes = withFontSizes;
withFontSizes.displayName = "withFontSizes";

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_Typeset.Typeset, {
  fontSizes: fontSizes,
  fontWeight: fontWeight
});

var withFontWeight = function withFontWeight() {
  return _ref2;
};

exports.withFontWeight = withFontWeight;
withFontWeight.displayName = "withFontWeight";

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_Typeset.Typeset, {
  fontSizes: fontSizes,
  fontFamily: fontFamily
});

var withFontFamily = function withFontFamily() {
  return _ref3;
};

exports.withFontFamily = withFontFamily;
withFontFamily.displayName = "withFontFamily";

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_Typeset.Typeset, {
  fontSizes: fontSizes,
  fontWeight: fontWeight,
  sampleText: "Heading"
});

var withWeightText = function withWeightText() {
  return _ref4;
};

exports.withWeightText = withWeightText;
withWeightText.displayName = "withWeightText";