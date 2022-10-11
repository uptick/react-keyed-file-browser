"use strict";

require("core-js/modules/es.object.assign");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markdown = exports.func = exports.complexObject = exports.arrayOf = exports.objectOf = exports.number = exports.longDesc = exports.longName = exports.string = exports.markdownDef = exports.funcDef = exports.complexDef = exports.arrayDef = exports.objectDef = exports.numberDef = exports.longDescDef = exports.longNameDef = exports.stringDef = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _PropRow = require("./PropRow");

var _PropsTable = require("./PropsTable");

var _DocumentFormatting = require("../../typography/DocumentFormatting");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  component: _PropRow.PropRow,
  title: 'Docs/PropRow',
  excludeStories: /.*Def$/,
  decorators: [function (getStory) {
    return _react["default"].createElement(_DocumentFormatting.ResetWrapper, null, _react["default"].createElement(_PropsTable.Table, null, _react["default"].createElement("tbody", null, getStory())));
  }]
};
exports["default"] = _default;
var stringDef = {
  name: 'someString',
  type: {
    summary: 'string'
  },
  required: true,
  description: 'someString description',
  defaultValue: {
    summary: 'fixme'
  }
};
exports.stringDef = stringDef;
var longNameDef = Object.assign({}, stringDef, {
  name: 'reallyLongStringThatTakesUpSpace'
});
exports.longNameDef = longNameDef;
var longDescDef = Object.assign({}, stringDef, {
  description: 'really long description that takes up a lot of space. sometimes this happens.'
});
exports.longDescDef = longDescDef;
var numberDef = {
  name: 'someNumber',
  type: {
    summary: 'number'
  },
  required: false,
  description: 'someNumber description',
  defaultValue: {
    summary: '0'
  }
};
exports.numberDef = numberDef;
var objectDef = {
  name: 'someObject',
  type: {
    summary: 'objectOf(number)'
  },
  required: false,
  description: 'A simple `objectOf` propType.',
  defaultValue: {
    summary: '{ key: 1 }'
  }
};
exports.objectDef = objectDef;
var arrayDef = {
  name: 'someOArray',
  type: {
    summary: 'number[]'
  },
  required: false,
  description: 'array of a certain type',
  defaultValue: {
    summary: '[1, 2, 3]'
  }
};
exports.arrayDef = arrayDef;
var complexDef = {
  name: 'someComplex',
  type: {
    summary: 'object',
    detail: "[{\n  id: number,\n  func: func,\n  arr: [{ index: number }]\n}]"
  },
  required: false,
  description: 'A very complex `objectOf` propType.',
  defaultValue: {
    summary: 'object',
    detail: "[{\n  id: 1,\n  func: () => {},\n  arr: [{ index: 1 }]\n}]"
  }
};
exports.complexDef = complexDef;
var funcDef = {
  name: 'concat',
  type: {
    summary: '(a: string, b: string) => string'
  },
  required: true,
  description: 'concat 2 string values.',
  defaultValue: {
    summary: 'func',
    detail: '(a, b) => { return a + b; }'
  },
  jsDocTags: {
    params: [{
      name: 'a',
      description: 'The first string'
    }, {
      name: 'b',
      description: 'The second string'
    }],
    returns: {
      description: 'The concatenation of both strings'
    }
  }
};
exports.funcDef = funcDef;
var markdownDef = {
  name: 'someString',
  type: {
    summary: 'string'
  },
  required: false,
  description: 'A `prop` can *support* __markdown__ syntax. This was ship in ~~5.2~~ 5.3. [Find more info in the storybook docs.](https://storybook.js.org/)'
};
exports.markdownDef = markdownDef;

var _ref =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: stringDef
});

var string = function string() {
  return _ref;
};

exports.string = string;
string.displayName = "string";

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: longNameDef
});

var longName = function longName() {
  return _ref2;
};

exports.longName = longName;
longName.displayName = "longName";

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: longDescDef
});

var longDesc = function longDesc() {
  return _ref3;
};

exports.longDesc = longDesc;
longDesc.displayName = "longDesc";

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: numberDef
});

var number = function number() {
  return _ref4;
};

exports.number = number;
number.displayName = "number";

var _ref5 =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: objectDef
});

var objectOf = function objectOf() {
  return _ref5;
};

exports.objectOf = objectOf;
objectOf.displayName = "objectOf";

var _ref6 =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: arrayDef
});

var arrayOf = function arrayOf() {
  return _ref6;
};

exports.arrayOf = arrayOf;
arrayOf.displayName = "arrayOf";

var _ref7 =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: complexDef
});

var complexObject = function complexObject() {
  return _ref7;
};

exports.complexObject = complexObject;
complexObject.displayName = "complexObject";

var _ref8 =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: funcDef
});

var func = function func() {
  return _ref8;
};

exports.func = func;
func.displayName = "func";

var _ref9 =
/*#__PURE__*/
_react["default"].createElement(_PropRow.PropRow, {
  row: markdownDef
});

var markdown = function markdown() {
  return _ref9;
};

exports.markdown = markdown;
markdown.displayName = "markdown";