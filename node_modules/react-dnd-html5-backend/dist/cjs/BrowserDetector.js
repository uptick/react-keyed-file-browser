"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSafari = exports.isFirefox = void 0;

var _js_utils = require("./utils/js_utils");

var isFirefox = (0, _js_utils.memoize)(function () {
  return /firefox/i.test(navigator.userAgent);
});
exports.isFirefox = isFirefox;
var isSafari = (0, _js_utils.memoize)(function () {
  return Boolean(window.safari);
});
exports.isSafari = isSafari;