"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataFromDataTransfer = getDataFromDataTransfer;

function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
  var result = typesToTry.reduce(function (resultSoFar, typeToTry) {
    return resultSoFar || dataTransfer.getData(typeToTry);
  }, '');
  return result != null ? result : defaultValue;
}