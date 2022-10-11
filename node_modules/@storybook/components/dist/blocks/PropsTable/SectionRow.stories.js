"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.props = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _SectionRow = require("./SectionRow");

var _PropsTable = require("./PropsTable");

var _DocumentFormatting = require("../../typography/DocumentFormatting");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  component: _SectionRow.SectionRow,
  title: 'Docs/SectionRow',
  decorators: [function (getStory) {
    return _react["default"].createElement(_DocumentFormatting.ResetWrapper, null, _react["default"].createElement(_PropsTable.Table, null, _react["default"].createElement("tbody", null, getStory())));
  }]
};
exports["default"] = _default;

var _ref =
/*#__PURE__*/
_react["default"].createElement(_SectionRow.SectionRow, {
  section: "Props"
});

var props = function props() {
  return _ref;
};

exports.props = props;
props.displayName = "props";