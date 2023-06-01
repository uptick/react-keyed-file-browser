"use strict";

exports.__esModule = true;
exports["default"] = cssVar;

var _errors = /*#__PURE__*/_interopRequireDefault( /*#__PURE__*/require("../internalHelpers/_errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cssVariableRegex = /--[\S]*/g;
/**
 * Fetches the value of a passed CSS Variable.
 *
 * Passthrough can be enabled (off by default) for when you are unsure of the input and want non-variable values to be returned instead of an error.
 *
 * @example
 * // Styles as object usage
 * const styles = {
 *   'background': cssVar('--background-color'),
 * }
 *
 * // styled-components usage
 * const div = styled.div`
 *   background: ${cssVar('--background-color')};
 * `
 *
 * // CSS in JS Output
 *
 * element {
 *   'background': 'red'
 * }
 */

function cssVar(cssVariable, passThrough) {
  if (!cssVariable || !cssVariable.match(cssVariableRegex)) {
    if (passThrough) return cssVariable;
    throw new _errors["default"](73);
  }

  var variableValue;
  /* eslint-disable */

  /* istanbul ignore next */

  if (typeof document !== 'undefined' && document.documentElement !== null) {
    variableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariable);
  }
  /* eslint-enable */


  if (variableValue) {
    return variableValue.trim();
  } else {
    throw new _errors["default"](74);
  }
}

module.exports = exports.default;