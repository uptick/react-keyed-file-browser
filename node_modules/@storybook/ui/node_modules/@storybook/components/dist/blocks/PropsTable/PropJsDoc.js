"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropJsDoc = exports.Table = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _lodash = require("lodash");

var _shared = require("../../typography/shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Table = _theming.styled.table(function (_ref) {
  var theme = _ref.theme;
  return {
    '&&': {
      // Escape default table styles
      borderCollapse: 'collapse',
      borderSpacing: 0,
      border: 'none',
      tr: {
        border: 'none !important',
        background: 'none'
      },
      'td, th': {
        padding: 0,
        border: 'none',
        width: 'auto!important'
      },
      // End escape
      marginTop: 0,
      marginBottom: 0,
      'th:first-of-type, td:first-of-type': {
        paddingLeft: 0
      },
      'th:last-of-type, td:last-of-type': {
        paddingRight: 0
      },
      td: {
        paddingTop: 0,
        paddingBottom: 4,
        '&:not(:first-of-type)': {
          paddingLeft: 10,
          paddingRight: 0
        }
      },
      tbody: {
        boxShadow: 'none',
        border: 'none'
      },
      code: (0, _shared.codeCommon)({
        theme: theme
      }),
      '& code': {
        margin: 0,
        display: 'inline-block'
      }
    }
  };
});

exports.Table = Table;

var _ref3 =
/*#__PURE__*/
_react["default"].createElement("td", null, _react["default"].createElement("code", null, "Returns"));

var PropJsDoc = function PropJsDoc(_ref2) {
  var tags = _ref2.tags;
  var params = (tags.params || []).filter(function (x) {
    return x.description;
  });
  var hasDisplayableParams = params.length !== 0;
  var hasDisplayableReturns = !(0, _lodash.isNil)(tags.returns) && !(0, _lodash.isNil)(tags.returns.description);

  if (!hasDisplayableParams && !hasDisplayableReturns) {
    return null;
  }

  return _react["default"].createElement(Table, null, _react["default"].createElement("tbody", null, hasDisplayableParams && params.map(function (x) {
    return _react["default"].createElement("tr", {
      key: x.name
    }, _react["default"].createElement("td", null, _react["default"].createElement("code", null, x.name)), _react["default"].createElement("td", null, x.description));
  }), hasDisplayableReturns && _react["default"].createElement("tr", {
    key: "returns"
  }, _ref3, _react["default"].createElement("td", null, tags.returns.description))));
};

exports.PropJsDoc = PropJsDoc;
PropJsDoc.displayName = "PropJsDoc";