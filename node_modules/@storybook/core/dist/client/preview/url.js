"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.search");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pathToId = pathToId;
exports.initializePath = exports.parseQueryParameters = exports.getIdFromLegacyQuery = exports.setPath = void 0;

var _global = require("global");

var _qs = _interopRequireDefault(require("qs"));

var _csf = require("@storybook/csf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function pathToId(path) {
  var match = (path || '').match(/^\/story\/(.+)/);

  if (!match) {
    throw new Error("Invalid path '".concat(path, "',  must start with '/story/'"));
  }

  return match[1];
}

var setPath = function setPath(_ref) {
  var storyId = _ref.storyId,
      viewMode = _ref.viewMode;

  var _qs$parse = _qs["default"].parse(_global.document.location.search, {
    ignoreQueryPrefix: true
  }),
      path = _qs$parse.path,
      selectedKind = _qs$parse.selectedKind,
      selectedStory = _qs$parse.selectedStory,
      rest = _objectWithoutProperties(_qs$parse, ["path", "selectedKind", "selectedStory"]);

  var newPath = "".concat(_global.document.location.pathname, "?").concat(_qs["default"].stringify(Object.assign({}, rest, {
    id: storyId,
    viewMode: viewMode
  })));

  _global.history.replaceState({}, '', newPath);
};

exports.setPath = setPath;

var getIdFromLegacyQuery = function getIdFromLegacyQuery(_ref2, storyStore) {
  var path = _ref2.path,
      selectedKind = _ref2.selectedKind,
      selectedStory = _ref2.selectedStory;

  if (path) {
    return pathToId(path);
  }

  if (selectedKind && selectedStory) {
    // Look up the story ID inside the story store, since as of 5.3, the
    // Story ID is not necessarily a direct function of its kind/name.
    var story = storyStore.getRawStory(selectedKind, selectedStory);

    if (story) {
      return story.id;
    } // this will preserve existing behavior of showing a "not found" screen,
    // but the inputs will be preserved in the query param to help debugging


    return (0, _csf.toId)(selectedKind, selectedStory);
  }

  return undefined;
};

exports.getIdFromLegacyQuery = getIdFromLegacyQuery;

var parseQueryParameters = function parseQueryParameters(search) {
  var _qs$parse2 = _qs["default"].parse(search, {
    ignoreQueryPrefix: true
  }),
      id = _qs$parse2.id;

  return id;
};

exports.parseQueryParameters = parseQueryParameters;

var initializePath = function initializePath(storyStore) {
  var query = _qs["default"].parse(_global.document.location.search, {
    ignoreQueryPrefix: true
  });

  var storyId = query.id,
      viewMode = query.viewMode; // eslint-disable-line prefer-const

  if (!storyId) {
    storyId = getIdFromLegacyQuery(query, storyStore);

    if (storyId) {
      setPath({
        storyId: storyId,
        viewMode: viewMode
      });
    }
  }

  return {
    storyId: storyId,
    viewMode: viewMode
  };
};

exports.initializePath = initializePath;