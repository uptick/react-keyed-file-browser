"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PropDef", {
  enumerable: true,
  get: function get() {
    return _PropDef.PropDef;
  }
});
Object.defineProperty(exports, "PropType", {
  enumerable: true,
  get: function get() {
    return _PropDef.PropType;
  }
});
Object.defineProperty(exports, "PropDefaultValue", {
  enumerable: true,
  get: function get() {
    return _PropDef.PropDefaultValue;
  }
});
Object.defineProperty(exports, "PropSummaryValue", {
  enumerable: true,
  get: function get() {
    return _PropDef.PropSummaryValue;
  }
});
exports.PropsTable = exports.PropsTableError = exports.Table = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _polished = require("polished");

var _PropRow = require("./PropRow");

var _SectionRow = require("./SectionRow");

var _PropDef = require("./PropDef");

var _EmptyBlock = require("../EmptyBlock");

var _DocumentFormatting = require("../../typography/DocumentFormatting");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Table = _theming.styled.table(function (_ref) {
  var theme = _ref.theme;
  return {
    '&&': {
      // Resets for cascading/system styles
      borderCollapse: 'collapse',
      borderSpacing: 0,
      color: theme.color.defaultText,
      tr: {
        border: 'none',
        background: 'none'
      },
      'td, th': {
        padding: 0,
        border: 'none',
        verticalAlign: 'top'
      },
      // End Resets
      fontSize: theme.typography.size.s2,
      lineHeight: '20px',
      textAlign: 'left',
      width: '100%',
      // Margin collapse
      marginTop: 25,
      marginBottom: 40,
      'th:first-of-type, td:first-of-type': {
        paddingLeft: 20
      },
      'th:last-of-type, td:last-of-type': {
        paddingRight: 20,
        width: '20%'
      },
      th: {
        color: theme.base === 'light' ? (0, _polished.transparentize)(0.25, theme.color.defaultText) : (0, _polished.transparentize)(0.45, theme.color.defaultText),
        paddingTop: 10,
        paddingBottom: 10,
        '&:not(:first-of-type)': {
          paddingLeft: 15,
          paddingRight: 15
        }
      },
      td: {
        paddingTop: '16px',
        paddingBottom: '16px',
        '&:not(:first-of-type)': {
          paddingLeft: 15,
          paddingRight: 15
        },
        '&:last-of-type': {
          paddingRight: 20
        }
      },
      // Table "block" styling
      // Emphasize tbody's background and set borderRadius
      // Calling out because styling tables is finicky
      // Makes border alignment consistent w/other DocBlocks
      marginLeft: 1,
      marginRight: 1,
      'tr:first-child': {
        'td:first-child, th:first-child': {
          borderTopLeftRadius: theme.appBorderRadius
        },
        'td:last-child, th:last-child': {
          borderTopRightRadius: theme.appBorderRadius
        }
      },
      'tr:last-child': {
        'td:first-child, th:first-child': {
          borderBottomLeftRadius: theme.appBorderRadius
        },
        'td:last-child, th:last-child': {
          borderBottomRightRadius: theme.appBorderRadius
        }
      },
      tbody: {
        // slightly different than the other DocBlock shadows to account for table styling gymnastics
        boxShadow: theme.base === 'light' ? "rgba(0, 0, 0, 0.10) 0 1px 3px 1px,\n          ".concat((0, _polished.transparentize)(0.035, theme.appBorderColor), " 0 0 0 1px") : "rgba(0, 0, 0, 0.20) 0 2px 5px 1px,\n          ".concat((0, _polished.opacify)(0.05, theme.appBorderColor), " 0 0 0 1px"),
        borderRadius: theme.appBorderRadius,
        tr: {
          background: 'transparent',
          overflow: 'hidden',
          '&:not(:first-child)': {
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            borderTopColor: theme.base === 'light' ? (0, _polished.darken)(0.1, theme.background.content) : (0, _polished.lighten)(0.05, theme.background.content)
          }
        },
        td: {
          background: theme.background.content
        }
      } // End finicky table styling

    }
  };
});

exports.Table = Table;
var PropsTableError;
exports.PropsTableError = PropsTableError;

(function (PropsTableError) {
  PropsTableError["NO_COMPONENT"] = "No component found";
  PropsTableError["PROPS_UNSUPPORTED"] = "Props unsupported. See Props documentation for your framework.";
})(PropsTableError || (exports.PropsTableError = PropsTableError = {}));

var PropsTableRow = function PropsTableRow(props) {
  var _ref2 = props,
      section = _ref2.section;

  if (section) {
    return _react["default"].createElement(_SectionRow.SectionRow, {
      section: section
    });
  }

  var _ref3 = props,
      row = _ref3.row;
  return _react["default"].createElement(_PropRow.PropRow, {
    row: row
  });
};

PropsTableRow.displayName = "PropsTableRow";

var _ref7 =
/*#__PURE__*/
_react["default"].createElement(_EmptyBlock.EmptyBlock, null, "No props found for this component");

var _ref8 =
/*#__PURE__*/
_react["default"].createElement("thead", {
  className: "docblock-propstable-head"
}, _react["default"].createElement("tr", null, _react["default"].createElement("th", null, "Name"), _react["default"].createElement("th", null, "Description"), _react["default"].createElement("th", null, "Default")));

/**
 * Display the props for a component as a props table. Each row is a collection of
 * PropDefs, usually derived from docgen info for the component.
 */
var PropsTable = function PropsTable(props) {
  var _ref4 = props,
      error = _ref4.error;

  if (error) {
    return _react["default"].createElement(_EmptyBlock.EmptyBlock, null, error);
  }

  var allRows = [];
  var _ref5 = props,
      sections = _ref5.sections;
  var _ref6 = props,
      rows = _ref6.rows;

  if (sections) {
    Object.keys(sections).forEach(function (section) {
      var sectionRows = sections[section];

      if (sectionRows && sectionRows.length > 0) {
        allRows.push({
          key: section,
          value: {
            section: section
          }
        });
        sectionRows.forEach(function (row) {
          allRows.push({
            key: "".concat(section, "_").concat(row.name),
            value: {
              row: row
            }
          });
        });
      }
    });
  } else if (rows) {
    allRows = rows.map(function (row) {
      return {
        key: row.name,
        value: {
          row: row
        }
      };
    });
  }

  if (allRows.length === 0) {
    return _ref7;
  }

  return _react["default"].createElement(_DocumentFormatting.ResetWrapper, null, _react["default"].createElement(Table, {
    className: "docblock-propstable"
  }, _ref8, _react["default"].createElement("tbody", {
    className: "docblock-propstable-body"
  }, allRows.map(function (row) {
    return _react["default"].createElement(PropsTableRow, _extends({
      key: row.key
    }, row.value));
  }))));
};

exports.PropsTable = PropsTable;
PropsTable.displayName = "PropsTable";