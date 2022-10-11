(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactDnDHTML5Backend = {}));
})(this, (function (exports) { 'use strict';

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

  function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }

  function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  var EnterLeaveCounter = /*#__PURE__*/function () {
    function EnterLeaveCounter(isNodeInDocument) {
      _classCallCheck$4(this, EnterLeaveCounter);

      _defineProperty$5(this, "entered", []);

      _defineProperty$5(this, "isNodeInDocument", void 0);

      this.isNodeInDocument = isNodeInDocument;
    }

    _createClass$4(EnterLeaveCounter, [{
      key: "enter",
      value: function enter(enteringNode) {
        var _this = this;

        var previousLength = this.entered.length;

        var isNodeEntered = function isNodeEntered(node) {
          return _this.isNodeInDocument(node) && (!node.contains || node.contains(enteringNode));
        };

        this.entered = union(this.entered.filter(isNodeEntered), [enteringNode]);
        return previousLength === 0 && this.entered.length > 0;
      }
    }, {
      key: "leave",
      value: function leave(leavingNode) {
        var previousLength = this.entered.length;
        this.entered = without(this.entered.filter(this.isNodeInDocument), leavingNode);
        return previousLength > 0 && this.entered.length === 0;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.entered = [];
      }
    }]);

    return EnterLeaveCounter;
  }();

  var isFirefox = memoize(function () {
    return /firefox/i.test(navigator.userAgent);
  });
  var isSafari = memoize(function () {
    return Boolean(window.safari);
  });

  function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }

  function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var MonotonicInterpolant = /*#__PURE__*/function () {
    function MonotonicInterpolant(xs, ys) {
      _classCallCheck$3(this, MonotonicInterpolant);

      _defineProperty$4(this, "xs", void 0);

      _defineProperty$4(this, "ys", void 0);

      _defineProperty$4(this, "c1s", void 0);

      _defineProperty$4(this, "c2s", void 0);

      _defineProperty$4(this, "c3s", void 0);

      var length = xs.length; // Rearrange xs and ys so that xs is sorted

      var indexes = [];

      for (var i = 0; i < length; i++) {
        indexes.push(i);
      }

      indexes.sort(function (a, b) {
        return xs[a] < xs[b] ? -1 : 1;
      }); // Get consecutive differences and slopes
      var dxs = [];
      var ms = [];
      var dx;
      var dy;

      for (var _i = 0; _i < length - 1; _i++) {
        dx = xs[_i + 1] - xs[_i];
        dy = ys[_i + 1] - ys[_i];
        dxs.push(dx);
        ms.push(dy / dx);
      } // Get degree-1 coefficients


      var c1s = [ms[0]];

      for (var _i2 = 0; _i2 < dxs.length - 1; _i2++) {
        var m2 = ms[_i2];
        var mNext = ms[_i2 + 1];

        if (m2 * mNext <= 0) {
          c1s.push(0);
        } else {
          dx = dxs[_i2];
          var dxNext = dxs[_i2 + 1];
          var common = dx + dxNext;
          c1s.push(3 * common / ((common + dxNext) / m2 + (common + dx) / mNext));
        }
      }

      c1s.push(ms[ms.length - 1]); // Get degree-2 and degree-3 coefficients

      var c2s = [];
      var c3s = [];
      var m;

      for (var _i3 = 0; _i3 < c1s.length - 1; _i3++) {
        m = ms[_i3];
        var c1 = c1s[_i3];
        var invDx = 1 / dxs[_i3];

        var _common = c1 + c1s[_i3 + 1] - m - m;

        c2s.push((m - c1 - _common) * invDx);
        c3s.push(_common * invDx * invDx);
      }

      this.xs = xs;
      this.ys = ys;
      this.c1s = c1s;
      this.c2s = c2s;
      this.c3s = c3s;
    }

    _createClass$3(MonotonicInterpolant, [{
      key: "interpolate",
      value: function interpolate(x) {
        var xs = this.xs,
            ys = this.ys,
            c1s = this.c1s,
            c2s = this.c2s,
            c3s = this.c3s; // The rightmost point in the dataset should give an exact result

        var i = xs.length - 1;

        if (x === xs[i]) {
          return ys[i];
        } // Search for the interval x is in, returning the corresponding y if x is one of the original xs


        var low = 0;
        var high = c3s.length - 1;
        var mid;

        while (low <= high) {
          mid = Math.floor(0.5 * (low + high));
          var xHere = xs[mid];

          if (xHere < x) {
            low = mid + 1;
          } else if (xHere > x) {
            high = mid - 1;
          } else {
            return ys[mid];
          }
        }

        i = Math.max(0, high); // Interpolate

        var diff = x - xs[i];
        var diffSq = diff * diff;
        return ys[i] + c1s[i] * diff + c2s[i] * diffSq + c3s[i] * diff * diffSq;
      }
    }]);

    return MonotonicInterpolant;
  }();

  var ELEMENT_NODE = 1;
  function getNodeClientOffset(node) {
    var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;

    if (!el) {
      return null;
    }

    var _el$getBoundingClient = el.getBoundingClientRect(),
        top = _el$getBoundingClient.top,
        left = _el$getBoundingClient.left;

    return {
      x: left,
      y: top
    };
  }
  function getEventClientOffset(e) {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function isImageNode(node) {
    var _document$documentEle;

    return node.nodeName === 'IMG' && (isFirefox() || !((_document$documentEle = document.documentElement) !== null && _document$documentEle !== void 0 && _document$documentEle.contains(node)));
  }

  function getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight) {
    var dragPreviewWidth = isImage ? dragPreview.width : sourceWidth;
    var dragPreviewHeight = isImage ? dragPreview.height : sourceHeight; // Work around @2x coordinate discrepancies in browsers

    if (isSafari() && isImage) {
      dragPreviewHeight /= window.devicePixelRatio;
      dragPreviewWidth /= window.devicePixelRatio;
    }

    return {
      dragPreviewWidth: dragPreviewWidth,
      dragPreviewHeight: dragPreviewHeight
    };
  }

  function getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint) {
    // The browsers will use the image intrinsic size under different conditions.
    // Firefox only cares if it's an image, but WebKit also wants it to be detached.
    var isImage = isImageNode(dragPreview);
    var dragPreviewNode = isImage ? sourceNode : dragPreview;
    var dragPreviewNodeOffsetFromClient = getNodeClientOffset(dragPreviewNode);
    var offsetFromDragPreview = {
      x: clientOffset.x - dragPreviewNodeOffsetFromClient.x,
      y: clientOffset.y - dragPreviewNodeOffsetFromClient.y
    };
    var sourceWidth = sourceNode.offsetWidth,
        sourceHeight = sourceNode.offsetHeight;
    var anchorX = anchorPoint.anchorX,
        anchorY = anchorPoint.anchorY;

    var _getDragPreviewSize = getDragPreviewSize(isImage, dragPreview, sourceWidth, sourceHeight),
        dragPreviewWidth = _getDragPreviewSize.dragPreviewWidth,
        dragPreviewHeight = _getDragPreviewSize.dragPreviewHeight;

    var calculateYOffset = function calculateYOffset() {
      var interpolantY = new MonotonicInterpolant([0, 0.5, 1], [// Dock to the top
      offsetFromDragPreview.y, // Align at the center
      offsetFromDragPreview.y / sourceHeight * dragPreviewHeight, // Dock to the bottom
      offsetFromDragPreview.y + dragPreviewHeight - sourceHeight]);
      var y = interpolantY.interpolate(anchorY); // Work around Safari 8 positioning bug

      if (isSafari() && isImage) {
        // We'll have to wait for @3x to see if this is entirely correct
        y += (window.devicePixelRatio - 1) * dragPreviewHeight;
      }

      return y;
    };

    var calculateXOffset = function calculateXOffset() {
      // Interpolate coordinates depending on anchor point
      // If you know a simpler way to do this, let me know
      var interpolantX = new MonotonicInterpolant([0, 0.5, 1], [// Dock to the left
      offsetFromDragPreview.x, // Align at the center
      offsetFromDragPreview.x / sourceWidth * dragPreviewWidth, // Dock to the right
      offsetFromDragPreview.x + dragPreviewWidth - sourceWidth]);
      return interpolantX.interpolate(anchorX);
    }; // Force offsets if specified in the options.


    var offsetX = offsetPoint.offsetX,
        offsetY = offsetPoint.offsetY;
    var isManualOffsetX = offsetX === 0 || offsetX;
    var isManualOffsetY = offsetY === 0 || offsetY;
    return {
      x: isManualOffsetX ? offsetX : calculateXOffset(),
      y: isManualOffsetY ? offsetY : calculateYOffset()
    };
  }

  var FILE = '__NATIVE_FILE__';
  var URL = '__NATIVE_URL__';
  var TEXT = '__NATIVE_TEXT__';
  var HTML = '__NATIVE_HTML__';

  var NativeTypes = /*#__PURE__*/Object.freeze({
    __proto__: null,
    FILE: FILE,
    URL: URL,
    TEXT: TEXT,
    HTML: HTML
  });

  function getDataFromDataTransfer(dataTransfer, typesToTry, defaultValue) {
    var result = typesToTry.reduce(function (resultSoFar, typeToTry) {
      return resultSoFar || dataTransfer.getData(typeToTry);
    }, '');
    return result != null ? result : defaultValue;
  }

  var _nativeTypesConfig;

  function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  var nativeTypesConfig = (_nativeTypesConfig = {}, _defineProperty$3(_nativeTypesConfig, FILE, {
    exposeProperties: {
      files: function files(dataTransfer) {
        return Array.prototype.slice.call(dataTransfer.files);
      },
      items: function items(dataTransfer) {
        return dataTransfer.items;
      },
      dataTransfer: function dataTransfer(_dataTransfer) {
        return _dataTransfer;
      }
    },
    matchesTypes: ['Files']
  }), _defineProperty$3(_nativeTypesConfig, HTML, {
    exposeProperties: {
      html: function html(dataTransfer, matchesTypes) {
        return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
      },
      dataTransfer: function dataTransfer(_dataTransfer2) {
        return _dataTransfer2;
      }
    },
    matchesTypes: ['Html', 'text/html']
  }), _defineProperty$3(_nativeTypesConfig, URL, {
    exposeProperties: {
      urls: function urls(dataTransfer, matchesTypes) {
        return getDataFromDataTransfer(dataTransfer, matchesTypes, '').split('\n');
      },
      dataTransfer: function dataTransfer(_dataTransfer3) {
        return _dataTransfer3;
      }
    },
    matchesTypes: ['Url', 'text/uri-list']
  }), _defineProperty$3(_nativeTypesConfig, TEXT, {
    exposeProperties: {
      text: function text(dataTransfer, matchesTypes) {
        return getDataFromDataTransfer(dataTransfer, matchesTypes, '');
      },
      dataTransfer: function dataTransfer(_dataTransfer4) {
        return _dataTransfer4;
      }
    },
    matchesTypes: ['Text', 'text/plain']
  }), _nativeTypesConfig);

  function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

  function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var NativeDragSource = /*#__PURE__*/function () {
    function NativeDragSource(config) {
      _classCallCheck$2(this, NativeDragSource);

      _defineProperty$2(this, "item", void 0);

      _defineProperty$2(this, "config", void 0);

      this.config = config;
      this.item = {};
      this.initializeExposedProperties();
    }

    _createClass$2(NativeDragSource, [{
      key: "initializeExposedProperties",
      value: function initializeExposedProperties() {
        var _this = this;

        Object.keys(this.config.exposeProperties).forEach(function (property) {
          Object.defineProperty(_this.item, property, {
            configurable: true,
            enumerable: true,
            get: function get() {
              // eslint-disable-next-line no-console
              console.warn("Browser doesn't allow reading \"".concat(property, "\" until the drop event."));
              return null;
            }
          });
        });
      }
    }, {
      key: "loadDataTransfer",
      value: function loadDataTransfer(dataTransfer) {
        var _this2 = this;

        if (dataTransfer) {
          var newProperties = {};
          Object.keys(this.config.exposeProperties).forEach(function (property) {
            newProperties[property] = {
              value: _this2.config.exposeProperties[property](dataTransfer, _this2.config.matchesTypes),
              configurable: true,
              enumerable: true
            };
          });
          Object.defineProperties(this.item, newProperties);
        }
      }
    }, {
      key: "canDrag",
      value: function canDrag() {
        return true;
      }
    }, {
      key: "beginDrag",
      value: function beginDrag() {
        return this.item;
      }
    }, {
      key: "isDragging",
      value: function isDragging(monitor, handle) {
        return handle === monitor.getSourceId();
      }
    }, {
      key: "endDrag",
      value: function endDrag() {// empty
      }
    }]);

    return NativeDragSource;
  }();

  function createNativeDragSource(type, dataTransfer) {
    var result = new NativeDragSource(nativeTypesConfig[type]);
    result.loadDataTransfer(dataTransfer);
    return result;
  }
  function matchNativeItemType(dataTransfer) {
    if (!dataTransfer) {
      return null;
    }

    var dataTransferTypes = Array.prototype.slice.call(dataTransfer.types || []);
    return Object.keys(nativeTypesConfig).filter(function (nativeItemType) {
      var matchesTypes = nativeTypesConfig[nativeItemType].matchesTypes;
      return matchesTypes.some(function (t) {
        return dataTransferTypes.indexOf(t) > -1;
      });
    })[0] || null;
  }

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

  function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var OptionsReader = /*#__PURE__*/function () {
    function OptionsReader(globalContext, options) {
      _classCallCheck$1(this, OptionsReader);

      _defineProperty$1(this, "ownerDocument", null);

      _defineProperty$1(this, "globalContext", void 0);

      _defineProperty$1(this, "optionsArgs", void 0);

      this.globalContext = globalContext;
      this.optionsArgs = options;
    }

    _createClass$1(OptionsReader, [{
      key: "window",
      get: function get() {
        if (this.globalContext) {
          return this.globalContext;
        } else if (typeof window !== 'undefined') {
          return window;
        }

        return undefined;
      }
    }, {
      key: "document",
      get: function get() {
        var _this$globalContext;

        if ((_this$globalContext = this.globalContext) !== null && _this$globalContext !== void 0 && _this$globalContext.document) {
          return this.globalContext.document;
        } else if (this.window) {
          return this.window.document;
        } else {
          return undefined;
        }
      }
    }, {
      key: "rootElement",
      get: function get() {
        var _this$optionsArgs;

        return ((_this$optionsArgs = this.optionsArgs) === null || _this$optionsArgs === void 0 ? void 0 : _this$optionsArgs.rootElement) || this.window;
      }
    }]);

    return OptionsReader;
  }();

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  var HTML5BackendImpl = /*#__PURE__*/function () {
    // React-Dnd Components
    // Internal State
    function HTML5BackendImpl(manager, globalContext, options) {
      var _this = this;

      _classCallCheck(this, HTML5BackendImpl);

      _defineProperty(this, "options", void 0);

      _defineProperty(this, "actions", void 0);

      _defineProperty(this, "monitor", void 0);

      _defineProperty(this, "registry", void 0);

      _defineProperty(this, "enterLeaveCounter", void 0);

      _defineProperty(this, "sourcePreviewNodes", new Map());

      _defineProperty(this, "sourcePreviewNodeOptions", new Map());

      _defineProperty(this, "sourceNodes", new Map());

      _defineProperty(this, "sourceNodeOptions", new Map());

      _defineProperty(this, "dragStartSourceIds", null);

      _defineProperty(this, "dropTargetIds", []);

      _defineProperty(this, "dragEnterTargetIds", []);

      _defineProperty(this, "currentNativeSource", null);

      _defineProperty(this, "currentNativeHandle", null);

      _defineProperty(this, "currentDragSourceNode", null);

      _defineProperty(this, "altKeyPressed", false);

      _defineProperty(this, "mouseMoveTimeoutTimer", null);

      _defineProperty(this, "asyncEndDragFrameId", null);

      _defineProperty(this, "dragOverTargetIds", null);

      _defineProperty(this, "lastClientOffset", null);

      _defineProperty(this, "hoverRafId", null);

      _defineProperty(this, "getSourceClientOffset", function (sourceId) {
        var source = _this.sourceNodes.get(sourceId);

        return source && getNodeClientOffset(source) || null;
      });

      _defineProperty(this, "endDragNativeItem", function () {
        if (!_this.isDraggingNativeItem()) {
          return;
        }

        _this.actions.endDrag();

        if (_this.currentNativeHandle) {
          _this.registry.removeSource(_this.currentNativeHandle);
        }

        _this.currentNativeHandle = null;
        _this.currentNativeSource = null;
      });

      _defineProperty(this, "isNodeInDocument", function (node) {
        // Check the node either in the main document or in the current context
        return Boolean(node && _this.document && _this.document.body && _this.document.body.contains(node));
      });

      _defineProperty(this, "endDragIfSourceWasRemovedFromDOM", function () {
        var node = _this.currentDragSourceNode;

        if (node == null || _this.isNodeInDocument(node)) {
          return;
        }

        if (_this.clearCurrentDragSourceNode() && _this.monitor.isDragging()) {
          _this.actions.endDrag();
        }
      });

      _defineProperty(this, "handleTopDragStartCapture", function () {
        _this.clearCurrentDragSourceNode();

        _this.dragStartSourceIds = [];
      });

      _defineProperty(this, "handleTopDragStart", function (e) {
        if (e.defaultPrevented) {
          return;
        }

        var dragStartSourceIds = _this.dragStartSourceIds;
        _this.dragStartSourceIds = null;
        var clientOffset = getEventClientOffset(e); // Avoid crashing if we missed a drop event or our previous drag died

        if (_this.monitor.isDragging()) {
          _this.actions.endDrag();
        } // Don't publish the source just yet (see why below)


        _this.actions.beginDrag(dragStartSourceIds || [], {
          publishSource: false,
          getSourceClientOffset: _this.getSourceClientOffset,
          clientOffset: clientOffset
        });

        var dataTransfer = e.dataTransfer;
        var nativeType = matchNativeItemType(dataTransfer);

        if (_this.monitor.isDragging()) {
          if (dataTransfer && typeof dataTransfer.setDragImage === 'function') {
            // Use custom drag image if user specifies it.
            // If child drag source refuses drag but parent agrees,
            // use parent's node as drag image. Neither works in IE though.
            var sourceId = _this.monitor.getSourceId();

            var sourceNode = _this.sourceNodes.get(sourceId);

            var dragPreview = _this.sourcePreviewNodes.get(sourceId) || sourceNode;

            if (dragPreview) {
              var _this$getCurrentSourc = _this.getCurrentSourcePreviewNodeOptions(),
                  anchorX = _this$getCurrentSourc.anchorX,
                  anchorY = _this$getCurrentSourc.anchorY,
                  offsetX = _this$getCurrentSourc.offsetX,
                  offsetY = _this$getCurrentSourc.offsetY;

              var anchorPoint = {
                anchorX: anchorX,
                anchorY: anchorY
              };
              var offsetPoint = {
                offsetX: offsetX,
                offsetY: offsetY
              };
              var dragPreviewOffset = getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint, offsetPoint);
              dataTransfer.setDragImage(dragPreview, dragPreviewOffset.x, dragPreviewOffset.y);
            }
          }

          try {
            // Firefox won't drag without setting data
            dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.setData('application/json', {});
          } catch (err) {// IE doesn't support MIME types in setData
          } // Store drag source node so we can check whether
          // it is removed from DOM and trigger endDrag manually.


          _this.setCurrentDragSourceNode(e.target); // Now we are ready to publish the drag source.. or are we not?


          var _this$getCurrentSourc2 = _this.getCurrentSourcePreviewNodeOptions(),
              captureDraggingState = _this$getCurrentSourc2.captureDraggingState;

          if (!captureDraggingState) {
            // Usually we want to publish it in the next tick so that browser
            // is able to screenshot the current (not yet dragging) state.
            //
            // It also neatly avoids a situation where render() returns null
            // in the same tick for the source element, and browser freaks out.
            setTimeout(function () {
              return _this.actions.publishDragSource();
            }, 0);
          } else {
            // In some cases the user may want to override this behavior, e.g.
            // to work around IE not supporting custom drag previews.
            //
            // When using a custom drag layer, the only way to prevent
            // the default drag preview from drawing in IE is to screenshot
            // the dragging state in which the node itself has zero opacity
            // and height. In this case, though, returning null from render()
            // will abruptly end the dragging, which is not obvious.
            //
            // This is the reason such behavior is strictly opt-in.
            _this.actions.publishDragSource();
          }
        } else if (nativeType) {
          // A native item (such as URL) dragged from inside the document
          _this.beginDragNativeItem(nativeType);
        } else if (dataTransfer && !dataTransfer.types && (e.target && !e.target.hasAttribute || !e.target.hasAttribute('draggable'))) {
          // Looks like a Safari bug: dataTransfer.types is null, but there was no draggable.
          // Just let it drag. It's a native type (URL or text) and will be picked up in
          // dragenter handler.
          return;
        } else {
          // If by this time no drag source reacted, tell browser not to drag.
          e.preventDefault();
        }
      });

      _defineProperty(this, "handleTopDragEndCapture", function () {
        if (_this.clearCurrentDragSourceNode() && _this.monitor.isDragging()) {
          // Firefox can dispatch this event in an infinite loop
          // if dragend handler does something like showing an alert.
          // Only proceed if we have not handled it already.
          _this.actions.endDrag();
        }
      });

      _defineProperty(this, "handleTopDragEnterCapture", function (e) {
        _this.dragEnterTargetIds = [];

        var isFirstEnter = _this.enterLeaveCounter.enter(e.target);

        if (!isFirstEnter || _this.monitor.isDragging()) {
          return;
        }

        var dataTransfer = e.dataTransfer;
        var nativeType = matchNativeItemType(dataTransfer);

        if (nativeType) {
          // A native item (such as file or URL) dragged from outside the document
          _this.beginDragNativeItem(nativeType, dataTransfer);
        }
      });

      _defineProperty(this, "handleTopDragEnter", function (e) {
        var dragEnterTargetIds = _this.dragEnterTargetIds;
        _this.dragEnterTargetIds = [];

        if (!_this.monitor.isDragging()) {
          // This is probably a native item type we don't understand.
          return;
        }

        _this.altKeyPressed = e.altKey; // If the target changes position as the result of `dragenter`, `dragover` might still
        // get dispatched despite target being no longer there. The easy solution is to check
        // whether there actually is a target before firing `hover`.

        if (dragEnterTargetIds.length > 0) {
          _this.actions.hover(dragEnterTargetIds, {
            clientOffset: getEventClientOffset(e)
          });
        }

        var canDrop = dragEnterTargetIds.some(function (targetId) {
          return _this.monitor.canDropOnTarget(targetId);
        });

        if (canDrop) {
          // IE requires this to fire dragover events
          e.preventDefault();

          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = _this.getCurrentDropEffect();
          }
        }
      });

      _defineProperty(this, "handleTopDragOverCapture", function () {
        _this.dragOverTargetIds = [];
      });

      _defineProperty(this, "handleTopDragOver", function (e) {
        var dragOverTargetIds = _this.dragOverTargetIds;
        _this.dragOverTargetIds = [];

        if (!_this.monitor.isDragging()) {
          // This is probably a native item type we don't understand.
          // Prevent default "drop and blow away the whole document" action.
          e.preventDefault();

          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'none';
          }

          return;
        }

        _this.altKeyPressed = e.altKey;
        _this.lastClientOffset = getEventClientOffset(e);

        if (_this.hoverRafId === null && typeof requestAnimationFrame !== 'undefined') {
          _this.hoverRafId = requestAnimationFrame(function () {
            if (_this.monitor.isDragging()) {
              _this.actions.hover(dragOverTargetIds || [], {
                clientOffset: _this.lastClientOffset
              });
            }

            _this.hoverRafId = null;
          });
        }

        var canDrop = (dragOverTargetIds || []).some(function (targetId) {
          return _this.monitor.canDropOnTarget(targetId);
        });

        if (canDrop) {
          // Show user-specified drop effect.
          e.preventDefault();

          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = _this.getCurrentDropEffect();
          }
        } else if (_this.isDraggingNativeItem()) {
          // Don't show a nice cursor but still prevent default
          // "drop and blow away the whole document" action.
          e.preventDefault();
        } else {
          e.preventDefault();

          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'none';
          }
        }
      });

      _defineProperty(this, "handleTopDragLeaveCapture", function (e) {
        if (_this.isDraggingNativeItem()) {
          e.preventDefault();
        }

        var isLastLeave = _this.enterLeaveCounter.leave(e.target);

        if (!isLastLeave) {
          return;
        }

        if (_this.isDraggingNativeItem()) {
          setTimeout(function () {
            return _this.endDragNativeItem();
          }, 0);
        }
      });

      _defineProperty(this, "handleTopDropCapture", function (e) {
        _this.dropTargetIds = [];

        if (_this.isDraggingNativeItem()) {
          var _this$currentNativeSo;

          e.preventDefault();
          (_this$currentNativeSo = _this.currentNativeSource) === null || _this$currentNativeSo === void 0 ? void 0 : _this$currentNativeSo.loadDataTransfer(e.dataTransfer);
        } else if (matchNativeItemType(e.dataTransfer)) {
          // Dragging some elements, like <a> and <img> may still behave like a native drag event,
          // even if the current drag event matches a user-defined type.
          // Stop the default behavior when we're not expecting a native item to be dropped.
          e.preventDefault();
        }

        _this.enterLeaveCounter.reset();
      });

      _defineProperty(this, "handleTopDrop", function (e) {
        var dropTargetIds = _this.dropTargetIds;
        _this.dropTargetIds = [];

        _this.actions.hover(dropTargetIds, {
          clientOffset: getEventClientOffset(e)
        });

        _this.actions.drop({
          dropEffect: _this.getCurrentDropEffect()
        });

        if (_this.isDraggingNativeItem()) {
          _this.endDragNativeItem();
        } else if (_this.monitor.isDragging()) {
          _this.actions.endDrag();
        }
      });

      _defineProperty(this, "handleSelectStart", function (e) {
        var target = e.target; // Only IE requires us to explicitly say
        // we want drag drop operation to start

        if (typeof target.dragDrop !== 'function') {
          return;
        } // Inputs and textareas should be selectable


        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        } // For other targets, ask IE
        // to enable drag and drop


        e.preventDefault();
        target.dragDrop();
      });

      this.options = new OptionsReader(globalContext, options);
      this.actions = manager.getActions();
      this.monitor = manager.getMonitor();
      this.registry = manager.getRegistry();
      this.enterLeaveCounter = new EnterLeaveCounter(this.isNodeInDocument);
    }
    /**
     * Generate profiling statistics for the HTML5Backend.
     */


    _createClass(HTML5BackendImpl, [{
      key: "profile",
      value: function profile() {
        var _this$dragStartSource, _this$dragOverTargetI;

        return {
          sourcePreviewNodes: this.sourcePreviewNodes.size,
          sourcePreviewNodeOptions: this.sourcePreviewNodeOptions.size,
          sourceNodeOptions: this.sourceNodeOptions.size,
          sourceNodes: this.sourceNodes.size,
          dragStartSourceIds: ((_this$dragStartSource = this.dragStartSourceIds) === null || _this$dragStartSource === void 0 ? void 0 : _this$dragStartSource.length) || 0,
          dropTargetIds: this.dropTargetIds.length,
          dragEnterTargetIds: this.dragEnterTargetIds.length,
          dragOverTargetIds: ((_this$dragOverTargetI = this.dragOverTargetIds) === null || _this$dragOverTargetI === void 0 ? void 0 : _this$dragOverTargetI.length) || 0
        };
      } // public for test

    }, {
      key: "window",
      get: function get() {
        return this.options.window;
      }
    }, {
      key: "document",
      get: function get() {
        return this.options.document;
      }
      /**
       * Get the root element to use for event subscriptions
       */

    }, {
      key: "rootElement",
      get: function get() {
        return this.options.rootElement;
      }
    }, {
      key: "setup",
      value: function setup() {
        var root = this.rootElement;

        if (root === undefined) {
          return;
        }

        if (root.__isReactDndBackendSetUp) {
          throw new Error('Cannot have two HTML5 backends at the same time.');
        }

        root.__isReactDndBackendSetUp = true;
        this.addEventListeners(root);
      }
    }, {
      key: "teardown",
      value: function teardown() {
        var root = this.rootElement;

        if (root === undefined) {
          return;
        }

        root.__isReactDndBackendSetUp = false;
        this.removeEventListeners(this.rootElement);
        this.clearCurrentDragSourceNode();

        if (this.asyncEndDragFrameId) {
          var _this$window;

          (_this$window = this.window) === null || _this$window === void 0 ? void 0 : _this$window.cancelAnimationFrame(this.asyncEndDragFrameId);
        }
      }
    }, {
      key: "connectDragPreview",
      value: function connectDragPreview(sourceId, node, options) {
        var _this2 = this;

        this.sourcePreviewNodeOptions.set(sourceId, options);
        this.sourcePreviewNodes.set(sourceId, node);
        return function () {
          _this2.sourcePreviewNodes.delete(sourceId);

          _this2.sourcePreviewNodeOptions.delete(sourceId);
        };
      }
    }, {
      key: "connectDragSource",
      value: function connectDragSource(sourceId, node, options) {
        var _this3 = this;

        this.sourceNodes.set(sourceId, node);
        this.sourceNodeOptions.set(sourceId, options);

        var handleDragStart = function handleDragStart(e) {
          return _this3.handleDragStart(e, sourceId);
        };

        var handleSelectStart = function handleSelectStart(e) {
          return _this3.handleSelectStart(e);
        };

        node.setAttribute('draggable', 'true');
        node.addEventListener('dragstart', handleDragStart);
        node.addEventListener('selectstart', handleSelectStart);
        return function () {
          _this3.sourceNodes.delete(sourceId);

          _this3.sourceNodeOptions.delete(sourceId);

          node.removeEventListener('dragstart', handleDragStart);
          node.removeEventListener('selectstart', handleSelectStart);
          node.setAttribute('draggable', 'false');
        };
      }
    }, {
      key: "connectDropTarget",
      value: function connectDropTarget(targetId, node) {
        var _this4 = this;

        var handleDragEnter = function handleDragEnter(e) {
          return _this4.handleDragEnter(e, targetId);
        };

        var handleDragOver = function handleDragOver(e) {
          return _this4.handleDragOver(e, targetId);
        };

        var handleDrop = function handleDrop(e) {
          return _this4.handleDrop(e, targetId);
        };

        node.addEventListener('dragenter', handleDragEnter);
        node.addEventListener('dragover', handleDragOver);
        node.addEventListener('drop', handleDrop);
        return function () {
          node.removeEventListener('dragenter', handleDragEnter);
          node.removeEventListener('dragover', handleDragOver);
          node.removeEventListener('drop', handleDrop);
        };
      }
    }, {
      key: "addEventListeners",
      value: function addEventListeners(target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.addEventListener) {
          return;
        }

        target.addEventListener('dragstart', this.handleTopDragStart);
        target.addEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.addEventListener('dragend', this.handleTopDragEndCapture, true);
        target.addEventListener('dragenter', this.handleTopDragEnter);
        target.addEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.addEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.addEventListener('dragover', this.handleTopDragOver);
        target.addEventListener('dragover', this.handleTopDragOverCapture, true);
        target.addEventListener('drop', this.handleTopDrop);
        target.addEventListener('drop', this.handleTopDropCapture, true);
      }
    }, {
      key: "removeEventListeners",
      value: function removeEventListeners(target) {
        // SSR Fix (https://github.com/react-dnd/react-dnd/pull/813
        if (!target.removeEventListener) {
          return;
        }

        target.removeEventListener('dragstart', this.handleTopDragStart);
        target.removeEventListener('dragstart', this.handleTopDragStartCapture, true);
        target.removeEventListener('dragend', this.handleTopDragEndCapture, true);
        target.removeEventListener('dragenter', this.handleTopDragEnter);
        target.removeEventListener('dragenter', this.handleTopDragEnterCapture, true);
        target.removeEventListener('dragleave', this.handleTopDragLeaveCapture, true);
        target.removeEventListener('dragover', this.handleTopDragOver);
        target.removeEventListener('dragover', this.handleTopDragOverCapture, true);
        target.removeEventListener('drop', this.handleTopDrop);
        target.removeEventListener('drop', this.handleTopDropCapture, true);
      }
    }, {
      key: "getCurrentSourceNodeOptions",
      value: function getCurrentSourceNodeOptions() {
        var sourceId = this.monitor.getSourceId();
        var sourceNodeOptions = this.sourceNodeOptions.get(sourceId);
        return _objectSpread({
          dropEffect: this.altKeyPressed ? 'copy' : 'move'
        }, sourceNodeOptions || {});
      }
    }, {
      key: "getCurrentDropEffect",
      value: function getCurrentDropEffect() {
        if (this.isDraggingNativeItem()) {
          // It makes more sense to default to 'copy' for native resources
          return 'copy';
        }

        return this.getCurrentSourceNodeOptions().dropEffect;
      }
    }, {
      key: "getCurrentSourcePreviewNodeOptions",
      value: function getCurrentSourcePreviewNodeOptions() {
        var sourceId = this.monitor.getSourceId();
        var sourcePreviewNodeOptions = this.sourcePreviewNodeOptions.get(sourceId);
        return _objectSpread({
          anchorX: 0.5,
          anchorY: 0.5,
          captureDraggingState: false
        }, sourcePreviewNodeOptions || {});
      }
    }, {
      key: "isDraggingNativeItem",
      value: function isDraggingNativeItem() {
        var itemType = this.monitor.getItemType();
        return Object.keys(NativeTypes).some(function (key) {
          return NativeTypes[key] === itemType;
        });
      }
    }, {
      key: "beginDragNativeItem",
      value: function beginDragNativeItem(type, dataTransfer) {
        this.clearCurrentDragSourceNode();
        this.currentNativeSource = createNativeDragSource(type, dataTransfer);
        this.currentNativeHandle = this.registry.addSource(type, this.currentNativeSource);
        this.actions.beginDrag([this.currentNativeHandle]);
      }
    }, {
      key: "setCurrentDragSourceNode",
      value: function setCurrentDragSourceNode(node) {
        var _this5 = this;

        this.clearCurrentDragSourceNode();
        this.currentDragSourceNode = node; // A timeout of > 0 is necessary to resolve Firefox issue referenced
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869

        var MOUSE_MOVE_TIMEOUT = 1000; // Receiving a mouse event in the middle of a dragging operation
        // means it has ended and the drag source node disappeared from DOM,
        // so the browser didn't dispatch the dragend event.
        //
        // We need to wait before we start listening for mousemove events.
        // This is needed because the drag preview needs to be drawn or else it fires an 'mousemove' event
        // immediately in some browsers.
        //
        // See:
        //   * https://github.com/react-dnd/react-dnd/pull/928
        //   * https://github.com/react-dnd/react-dnd/issues/869
        //

        this.mouseMoveTimeoutTimer = setTimeout(function () {
          var _this5$rootElement;

          return (_this5$rootElement = _this5.rootElement) === null || _this5$rootElement === void 0 ? void 0 : _this5$rootElement.addEventListener('mousemove', _this5.endDragIfSourceWasRemovedFromDOM, true);
        }, MOUSE_MOVE_TIMEOUT);
      }
    }, {
      key: "clearCurrentDragSourceNode",
      value: function clearCurrentDragSourceNode() {
        if (this.currentDragSourceNode) {
          this.currentDragSourceNode = null;

          if (this.rootElement) {
            var _this$window2;

            (_this$window2 = this.window) === null || _this$window2 === void 0 ? void 0 : _this$window2.clearTimeout(this.mouseMoveTimeoutTimer || undefined);
            this.rootElement.removeEventListener('mousemove', this.endDragIfSourceWasRemovedFromDOM, true);
          }

          this.mouseMoveTimeoutTimer = null;
          return true;
        }

        return false;
      }
    }, {
      key: "handleDragStart",
      value: function handleDragStart(e, sourceId) {
        if (e.defaultPrevented) {
          return;
        }

        if (!this.dragStartSourceIds) {
          this.dragStartSourceIds = [];
        }

        this.dragStartSourceIds.unshift(sourceId);
      }
    }, {
      key: "handleDragEnter",
      value: function handleDragEnter(e, targetId) {
        this.dragEnterTargetIds.unshift(targetId);
      }
    }, {
      key: "handleDragOver",
      value: function handleDragOver(e, targetId) {
        if (this.dragOverTargetIds === null) {
          this.dragOverTargetIds = [];
        }

        this.dragOverTargetIds.unshift(targetId);
      }
    }, {
      key: "handleDrop",
      value: function handleDrop(e, targetId) {
        this.dropTargetIds.unshift(targetId);
      }
    }]);

    return HTML5BackendImpl;
  }();

  var emptyImage;
  function getEmptyImage() {
    if (!emptyImage) {
      emptyImage = new Image();
      emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }

    return emptyImage;
  }

  var HTML5Backend = function createBackend(manager, context, options) {
    return new HTML5BackendImpl(manager, context, options);
  };

  exports.HTML5Backend = HTML5Backend;
  exports.NativeTypes = NativeTypes;
  exports.getEmptyImage = getEmptyImage;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
