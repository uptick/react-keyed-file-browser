"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

require("regenerator-runtime/runtime");

var _global = require("global");

var _semver = _interopRequireDefault(require("semver"));

var _memoizerific = _interopRequireDefault(require("memoizerific"));

var _version = require("../version");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getVersionCheckData = (0, _memoizerific["default"])(1)(function () {
  try {
    return Object.assign({}, JSON.parse(_global.VERSIONCHECK).data || {});
  } catch (e) {
    return {};
  }
});

function _default(_ref) {
  var store = _ref.store,
      mode = _ref.mode;

  var _store$getState = store.getState(),
      dismissedVersionNotification = _store$getState.dismissedVersionNotification;

  var state = {
    versions: Object.assign({
      current: {
        version: _version.version
      }
    }, getVersionCheckData()),
    dismissedVersionNotification: dismissedVersionNotification
  };
  var api = {
    getCurrentVersion: function getCurrentVersion() {
      var _store$getState2 = store.getState(),
          current = _store$getState2.versions.current;

      return current;
    },
    getLatestVersion: function getLatestVersion() {
      var _store$getState3 = store.getState(),
          _store$getState3$vers = _store$getState3.versions,
          latest = _store$getState3$vers.latest,
          next = _store$getState3$vers.next,
          current = _store$getState3$vers.current;

      if (current && _semver["default"].prerelease(current.version) && next) {
        return latest && _semver["default"].gt(latest.version, next.version) ? latest : next;
      }

      return latest;
    },
    versionUpdateAvailable: function versionUpdateAvailable() {
      var latest = api.getLatestVersion();
      var current = api.getCurrentVersion();

      if (latest) {
        if (!latest.version) {
          return true;
        }

        if (!current.version) {
          return true;
        }

        var onPrerelease = !!_semver["default"].prerelease(current.version);
        var actualCurrent = onPrerelease ? "".concat(_semver["default"].major(current.version), ".").concat(_semver["default"].minor(current.version), ".").concat(_semver["default"].patch(current.version)) : current.version;

        var diff = _semver["default"].diff(actualCurrent, latest.version);

        return _semver["default"].gt(latest.version, actualCurrent) && diff !== 'patch' && !diff.includes('pre');
      }

      return false;
    }
  }; // Grab versions from the server/local storage right away

  function init(_x) {
    return _init.apply(this, arguments);
  }

  function _init() {
    _init = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(_ref2) {
      var fullApi, _store$getState4, _store$getState4$vers, versions, _getVersionCheckData, latest, next, latestVersion, diff;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              fullApi = _ref2.api;
              _store$getState4 = store.getState(), _store$getState4$vers = _store$getState4.versions, versions = _store$getState4$vers === void 0 ? {} : _store$getState4$vers;
              _getVersionCheckData = getVersionCheckData(), latest = _getVersionCheckData.latest, next = _getVersionCheckData.next;
              _context.next = 5;
              return store.setState({
                versions: Object.assign({}, versions, {
                  latest: latest,
                  next: next
                })
              });

            case 5:
              if (api.versionUpdateAvailable()) {
                latestVersion = api.getLatestVersion().version;
                diff = _semver["default"].diff(versions.current.version, versions.latest.version);

                if (latestVersion !== dismissedVersionNotification && diff !== 'patch' && !_semver["default"].prerelease(latestVersion) && mode !== 'production') {
                  fullApi.addNotification({
                    id: 'update',
                    link: '/settings/about',
                    content: "\uD83C\uDF89 Storybook ".concat(latestVersion, " is available!"),
                    onClear: function onClear() {
                      store.setState({
                        dismissedVersionNotification: latestVersion
                      }, {
                        persistence: 'permanent'
                      });
                    }
                  });
                }
              }

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _init.apply(this, arguments);
  }

  return {
    init: init,
    state: state,
    api: api
  };
}