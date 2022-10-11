"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SectionRow = void 0;

var _react = _interopRequireDefault(require("react"));

var _polished = require("polished");

var _theming = require("@storybook/theming");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SectionTh = _theming.styled.th(function (_ref) {
  var theme = _ref.theme;
  return {
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    fontWeight: theme.typography.weight.black,
    fontSize: theme.typography.size.s1 - 1,
    lineHeight: '24px',
    color: theme.base === 'light' ? (0, _polished.transparentize)(0.4, theme.color.defaultText) : (0, _polished.transparentize)(0.6, theme.color.defaultText),
    background: "".concat(theme.background.app, " !important")
  };
});

var SectionRow = function SectionRow(_ref2) {
  var section = _ref2.section;
  return _react["default"].createElement("tr", null, _react["default"].createElement(SectionTh, {
    colSpan: 3
  }, section));
};

exports.SectionRow = SectionRow;
SectionRow.displayName = "SectionRow";