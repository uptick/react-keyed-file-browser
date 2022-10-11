"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.memoize = memoize;
exports.without = without;
exports.union = union;

// cheap lodash replacements
function memoize(fn) {
  var result = null;

  var memoized = function memoized() {
    if (result == null) {
      result = fn();
    }

    return result;
  };

  return memoized;
}
/**
 * drop-in replacement for _.without
 */


function without(items, item) {
  return items.filter(function (i) {
    return i !== item;
  });
}

function union(itemsA, itemsB) {
  var set = new Set();

  var insertItem = function insertItem(item) {
    return set.add(item);
  };

  itemsA.forEach(insertItem);
  itemsB.forEach(insertItem);
  var result = [];
  set.forEach(function (key) {
    return result.push(key);
  });
  return result;
}