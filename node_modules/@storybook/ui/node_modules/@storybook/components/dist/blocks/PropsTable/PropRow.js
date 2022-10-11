"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropRow = void 0;

var _react = _interopRequireDefault(require("react"));

var _markdownToJsx = _interopRequireDefault(require("markdown-to-jsx"));

var _lodash = require("lodash");

var _polished = require("polished");

var _theming = require("@storybook/theming");

var _PropJsDoc = require("./PropJsDoc");

var _PropValue = require("./PropValue");

var _shared = require("../../typography/shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Name = _theming.styled.span({
  fontWeight: 'bold'
});

var Required = _theming.styled.span(function (_ref) {
  var theme = _ref.theme;
  return {
    color: theme.color.negative,
    fontFamily: theme.typography.fonts.mono,
    cursor: 'help'
  };
});

var Description = _theming.styled.div(function (_ref2) {
  var theme = _ref2.theme;
  return {
    '&&': {
      p: {
        margin: '0 0 10px 0'
      },
      a: {
        textDecoration: 'underline',
        '&:hover': {
          textDecoration: 'none'
        }
      }
    },
    code: (0, _shared.codeCommon)({
      theme: theme
    }),
    '& code': {
      margin: 0,
      display: 'inline-block'
    }
  };
});

var Type = _theming.styled.div(function (_ref3) {
  var theme = _ref3.theme,
      hasDescription = _ref3.hasDescription;
  return {
    color: theme.base === 'light' ? (0, _polished.transparentize)(0.1, theme.color.defaultText) : (0, _polished.transparentize)(0.2, theme.color.defaultText),
    marginTop: hasDescription ? 4 : 0
  };
});

var TypeWithJsDoc = _theming.styled.div(function (_ref4) {
  var theme = _ref4.theme,
      hasDescription = _ref4.hasDescription;
  return {
    color: theme.base === 'light' ? (0, _polished.transparentize)(0.1, theme.color.defaultText) : (0, _polished.transparentize)(0.2, theme.color.defaultText),
    marginTop: hasDescription ? 12 : 0,
    marginBottom: 12
  };
});

var _ref6 =
/*#__PURE__*/
_react["default"].createElement(Required, {
  title: "Required"
}, "*");

var PropRow = function PropRow(_ref5) {
  var _ref5$row = _ref5.row,
      name = _ref5$row.name,
      type = _ref5$row.type,
      required = _ref5$row.required,
      description = _ref5$row.description,
      defaultValue = _ref5$row.defaultValue,
      jsDocTags = _ref5$row.jsDocTags;
  var hasDescription = !(0, _lodash.isNil)(description) && description !== '';
  return _react["default"].createElement("tr", null, _react["default"].createElement("td", null, _react["default"].createElement(Name, null, name), required ? _ref6 : null), _react["default"].createElement("td", null, hasDescription && _react["default"].createElement(Description, null, _react["default"].createElement(_markdownToJsx["default"], null, description)), !(0, _lodash.isNil)(jsDocTags) ? _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(TypeWithJsDoc, {
    hasDescription: hasDescription
  }, _react["default"].createElement(_PropValue.PropValue, {
    value: type
  })), _react["default"].createElement(_PropJsDoc.PropJsDoc, {
    tags: jsDocTags
  })) : _react["default"].createElement(Type, {
    hasDescription: hasDescription
  }, _react["default"].createElement(_PropValue.PropValue, {
    value: type
  }))), _react["default"].createElement("td", null, _react["default"].createElement(_PropValue.PropValue, {
    value: defaultValue
  })));
};

exports.PropRow = PropRow;
PropRow.displayName = "PropRow";