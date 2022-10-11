"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  components: true
};
Object.defineProperty(exports, "components", {
  enumerable: true,
  get: function get() {
    return _DocumentFormatting.components;
  }
});

var _DocumentFormatting = require("./typography/DocumentFormatting");

Object.keys(_DocumentFormatting).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _DocumentFormatting[key];
    }
  });
});