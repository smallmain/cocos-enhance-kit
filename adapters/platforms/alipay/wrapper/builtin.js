/*!
 * 
 * 			adpater.js
 * 			create time "1.0.1_2302221129"
 * 			
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Audio.js":
/*!**********************!*\
  !*** ./src/Audio.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HTMLAudioElement2 = __webpack_require__(/*! ./HTMLAudioElement */ "./src/HTMLAudioElement.js");

var _HTMLAudioElement3 = _interopRequireDefault(_HTMLAudioElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _innerAudioContextMap = new WeakMap();

var HAVE_NOTHING = 0;
var HAVE_METADATA = 1;
var HAVE_CURRENT_DATA = 2;
var HAVE_FUTURE_DATA = 3;
var HAVE_ENOUGH_DATA = 4;

var Audio = function (_HTMLAudioElement) {
    _inherits(Audio, _HTMLAudioElement);

    function Audio(url) {
        _classCallCheck(this, Audio);

        var _this = _possibleConstructorReturn(this, (Audio.__proto__ || Object.getPrototypeOf(Audio)).call(this));

        _this.readyState = HAVE_NOTHING;

        var innerAudioContext = my.createInnerAudioContext();
        _innerAudioContextMap.set(_this, innerAudioContext);

        _this._canplayEvents = ['load', 'loadend', 'canplay', 'canplaythrough', 'loadedmetadata'];

        innerAudioContext.onCanPlay(function () {
            _this._loaded = true;
            _this.readyState = HAVE_CURRENT_DATA;

            _this._canplayEvents.forEach(function (type) {
                _this.dispatchEvent({ type: type });
            });

            if (typeof _this.oncanplay === "function") {
                _this.oncanplay();
            }
        });

        innerAudioContext.onPlay(function () {
            // this._paused = _innerAudioContextMap.get(this).paused
            _this._paused = false;
            _this.dispatchEvent({ type: 'play' });
            if (typeof _this.onplay === "function") {
                _this.onplay();
            }
        });

        innerAudioContext.onPause(function () {
            _this._paused = true;
            _this.dispatchEvent({ type: 'pause' });
            if (typeof _this.onpause === "function") {
                _this.onpause();
            }
        });

        innerAudioContext.onEnded(function () {
            // this._paused = _innerAudioContextMap.get(this).paused
            _this._paused = false;
            _this.dispatchEvent({ type: 'ended' });
            _this.readyState = HAVE_ENOUGH_DATA;

            if (typeof _this.onended === "function") {
                _this.onended();
            }
        });

        innerAudioContext.onError(function () {
            // this._paused = _innerAudioContextMap.get(this).paused
            _this._paused = true;
            _this.dispatchEvent({ type: 'error' });
            if (typeof _this.onerror === "function") {
                _this.onerror();
            }
        });

        if (url) {
            _this.src = url;
        } else {
            _this._src = '';
        }

        _this._loop = innerAudioContext.loop;
        _this._autoplay = innerAudioContext.autoplay;
        _this._paused = innerAudioContext.paused;
        _this._volume = innerAudioContext.volume;
        _this._muted = false;
        return _this;
    }

    _createClass(Audio, [{
        key: 'addEventListener',
        value: function addEventListener(type, listener) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            type = String(type).toLowerCase();

            _get(Audio.prototype.__proto__ || Object.getPrototypeOf(Audio.prototype), 'addEventListener', this).call(this, type, listener, options);

            if (this._loaded && this._canplayEvents.indexOf(type) !== -1) {
                this.dispatchEvent({ type: type });
            }
        }
    }, {
        key: 'load',
        value: function load() {
            // console.warn('HTMLAudioElement.load() is not implemented.')
            // weixin doesn't need call load() manually
        }
    }, {
        key: 'play',
        value: function play() {
            _innerAudioContextMap.get(this).play();
        }
    }, {
        key: 'resume',
        value: function resume() {
            _innerAudioContextMap.get(this).play();
        }
    }, {
        key: 'pause',
        value: function pause() {
            _innerAudioContextMap.get(this).pause();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            console.log("destory: " + _typeof(_innerAudioContextMap.get(this).destroy));
            _innerAudioContextMap.get(this).destroy();
        }
    }, {
        key: 'canPlayType',
        value: function canPlayType() {
            var mediaType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            if (typeof mediaType !== 'string') {
                return '';
            }

            if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
                return 'probably';
            }
            return '';
        }
    }, {
        key: 'cloneNode',
        value: function cloneNode() {
            var newAudio = new Audio();
            newAudio.loop = this.loop;
            newAudio.autoplay = this.autoplay;
            newAudio.src = this.src;
            return newAudio;
        }
    }, {
        key: 'currentTime',
        get: function get() {
            return _innerAudioContextMap.get(this).currentTime;
        },
        set: function set(value) {
            _innerAudioContextMap.get(this).seek(value);
        }
    }, {
        key: 'duration',
        get: function get() {
            return _innerAudioContextMap.get(this).duration;
        }
    }, {
        key: 'src',
        get: function get() {
            return this._src;
        },
        set: function set(value) {
            this._src = value;
            this._loaded = false;
            this.readyState = HAVE_NOTHING;

            var innerAudioContext = _innerAudioContextMap.get(this);

            innerAudioContext.src = value;
        }
    }, {
        key: 'loop',
        get: function get() {
            return this._loop;
        },
        set: function set(value) {
            this._loop = value;
            _innerAudioContextMap.get(this).loop = value;
        }
    }, {
        key: 'autoplay',
        get: function get() {
            return this._autoplay;
        },
        set: function set(value) {
            this._autoplay = value;
            _innerAudioContextMap.get(this).autoplay = value;
        }
    }, {
        key: 'paused',
        get: function get() {
            return this._paused;
        }
    }, {
        key: 'volume',
        get: function get() {
            return this._volume;
        },
        set: function set(value) {
            this._volume = value;
            if (!this._muted) {
                _innerAudioContextMap.get(this).volume = value;
            }
        }
    }, {
        key: 'muted',
        get: function get() {
            return this._muted;
        },
        set: function set(value) {
            this._muted = value;
            if (value) {
                _innerAudioContextMap.get(this).volume = 0;
            } else {
                _innerAudioContextMap.get(this).volume = this._volume;
            }
        }
    }]);

    return Audio;
}(_HTMLAudioElement3.default);

exports.default = Audio;

/***/ }),

/***/ "./src/Base64.js":
/*!***********************!*\
  !*** ./src/Base64.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function InvalidCharacterError(message) {
    this.message = message;
}
InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

// encoder
// [https://gist.github.com/999166] by [https://github.com/nignag]

function btoa(input) {
    var str = String(input);
    var output = '';
    for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
        charCode = str.charCodeAt(idx += 3 / 4);
        if (charCode > 0xFF) {
            throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
    }
    return output;
}

// decoder
// [https://gist.github.com/1020396] by [https://github.com/atk]
function atob(input) {
    var str = String(input).replace(/[=]+$/, '');
    var output = '';
    for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0;
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
    // and if not first of each 4 characters,
    // convert the first 8 bits to one ascii character
    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    return output;
}

exports.btoa = btoa;
exports.atob = atob;

/***/ }),

/***/ "./src/Blob.js":
/*!*********************!*\
  !*** ./src/Blob.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Blob = function () {
  /**
   *
   * @param buffers only support zero index
   * @param type mimetype image/png image/webp...
   */
  function Blob(buffers, type) {
    _classCallCheck(this, Blob);

    this.buffers = buffers || [];
    this.type = type.type || "";
    if (typeof type === 'string') {
      this.type = type;
    }
  }

  _createClass(Blob, [{
    key: "arraybuffer",
    value: function arraybuffer() {
      return Promise.resolve(this.buffers[0]);
    }
  }, {
    key: "stream",
    value: function stream() {
      throw "not implemented";
    }
  }, {
    key: "text",
    value: function text() {
      throw "not implemented";
    }
  }, {
    key: "slice",
    value: function slice(start, end, contentType) {
      throw "not implemented";
    }
  }]);

  return Blob;
}();

exports.default = Blob;

/***/ }),

/***/ "./src/Canvas.js":
/*!***********************!*\
  !*** ./src/Canvas.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Canvas;

var _HTMLCanvasElement = __webpack_require__(/*! ./HTMLCanvasElement */ "./src/HTMLCanvasElement.js");

var _HTMLCanvasElement2 = _interopRequireDefault(_HTMLCanvasElement);

var _util = __webpack_require__(/*! ./utils/util */ "./src/utils/util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Canvas() {
    var canvas = my.createCanvas();

    if (!_util.isIDE) {
        if (!('tagName' in canvas)) {
            canvas.tagName = 'canvas';
        }

        canvas.__proto__.__proto__ = new _HTMLCanvasElement2.default();
    }

    return canvas;
}

/***/ }),

/***/ "./src/Element.js":
/*!************************!*\
  !*** ./src/Element.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Node2 = __webpack_require__(/*! ./Node */ "./src/Node.js");

var _Node3 = _interopRequireDefault(_Node2);

var _noop = __webpack_require__(/*! ./utils/noop */ "./src/utils/noop.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = function (_Node) {
    _inherits(Element, _Node);

    function Element() {
        _classCallCheck(this, Element);

        var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this));

        _this.className = '';
        _this.children = [];

        _this.remove = _noop.noop;
        return _this;
    }

    _createClass(Element, [{
        key: "setAttribute",
        value: function setAttribute(name, value) {
            this[name] = value;
        }
    }, {
        key: "getAttribute",
        value: function getAttribute(name) {
            return this[name];
        }
    }, {
        key: "setAttributeNS",
        value: function setAttributeNS(name, value) {
            this[name] = value;
        }
    }, {
        key: "getAttributeNS",
        value: function getAttributeNS(name) {
            return this[name];
        }
    }]);

    return Element;
}(_Node3.default);

exports.default = Element;

/***/ }),

/***/ "./src/Event.js":
/*!**********************!*\
  !*** ./src/Event.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _noop = __webpack_require__(/*! ./utils/noop */ "./src/utils/noop.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = function Event(type) {
    _classCallCheck(this, Event);

    this.cancelBubble = false;
    this.cacelable = false;
    this.target = null;
    this.timestampe = Date.now();
    this.preventDefault = _noop.noop;
    this.stopPropagation = _noop.noop;

    this.type = type;
};

exports.default = Event;

/***/ }),

/***/ "./src/EventIniter/MouseEvent.js":
/*!***************************************!*\
  !*** ./src/EventIniter/MouseEvent.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MouseEvent = function MouseEvent() {
  _classCallCheck(this, MouseEvent);
};

exports.default = MouseEvent;

/***/ }),

/***/ "./src/EventIniter/TouchEvent.js":
/*!***************************************!*\
  !*** ./src/EventIniter/TouchEvent.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Event2 = __webpack_require__(/*! ../Event */ "./src/Event.js");

var _Event3 = _interopRequireDefault(_Event2);

var _document = __webpack_require__(/*! ../document */ "./src/document.js");

var _document2 = _interopRequireDefault(_document);

var _util = __webpack_require__(/*! ../utils/util */ "./src/utils/util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TouchEvent = function (_Event) {
    _inherits(TouchEvent, _Event);

    function TouchEvent(type) {
        _classCallCheck(this, TouchEvent);

        var _this = _possibleConstructorReturn(this, (TouchEvent.__proto__ || Object.getPrototypeOf(TouchEvent)).call(this, type));

        _this.touches = [];
        _this.targetTouches = [];
        _this.changedTouches = [];

        _this.target = window.canvas;
        _this.currentTarget = window.canvas;
        return _this;
    }

    return TouchEvent;
}(_Event3.default);

exports.default = TouchEvent;


function eventHandlerFactory(type) {
    return function (rawEvent) {
        if (_util.isIDE) return;
        var event = new TouchEvent(type);

        event.changedTouches = rawEvent.touches;
        event.touches = rawEvent.touches;
        event.targetTouches = Array.prototype.slice.call(rawEvent.touches);
        // event.timeStamp = rawEvent.timeStamp
        _document2.default.dispatchEvent(event);
    };
}

my.onTouchStart(eventHandlerFactory('touchstart'));
my.onTouchMove(eventHandlerFactory('touchmove'));
my.onTouchEnd(eventHandlerFactory('touchend'));
my.onTouchCancel(eventHandlerFactory('touchcancel'));

/***/ }),

/***/ "./src/EventIniter/index.js":
/*!**********************************!*\
  !*** ./src/EventIniter/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TouchEvent = __webpack_require__(/*! ./TouchEvent */ "./src/EventIniter/TouchEvent.js");

Object.defineProperty(exports, 'TouchEvent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_TouchEvent).default;
  }
});

var _MouseEvent = __webpack_require__(/*! ./MouseEvent */ "./src/EventIniter/MouseEvent.js");

Object.defineProperty(exports, 'MouseEvent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MouseEvent).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ "./src/EventTarget.js":
/*!****************************!*\
  !*** ./src/EventTarget.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _events = new WeakMap();

var EventTarget = function () {
    function EventTarget() {
        _classCallCheck(this, EventTarget);

        _events.set(this, {});
    }

    _createClass(EventTarget, [{
        key: "addEventListener",
        value: function addEventListener(type, listener) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var events = _events.get(this);

            if (!events) {
                events = {};
                _events.set(this, events);
            }

            if (!events[type]) {
                events[type] = [];
            }
            events[type].push(listener);
        }
    }, {
        key: "removeEventListener",
        value: function removeEventListener(type, listener) {
            var events = _events.get(this);
            if (events) {
                var listeners = events[type];
                if (listeners && listeners.length > 0) {
                    for (var i = listeners.length; i--; i > 0) {
                        if (listeners[i] === listener) {
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
    }, {
        key: "dispatchEvent",
        value: function dispatchEvent() {
            var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (typeof event.type !== "string") {
                return;
            }

            if (!_events.get(this)) {
                return;
            }

            var listeners = _events.get(this)[event.type];
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    var listener = listeners[i];
                    listener.call(this, event);
                }
            }
        }
    }]);

    return EventTarget;
}();

exports.default = EventTarget;

/***/ }),

/***/ "./src/FileReader.js":
/*!***************************!*\
  !*** ./src/FileReader.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileReader = function () {
    function FileReader() {
        _classCallCheck(this, FileReader);
    }

    _createClass(FileReader, [{
        key: "construct",
        value: function construct() {}
    }]);

    return FileReader;
}();

exports.default = FileReader;

/***/ }),

/***/ "./src/HTMLAudioElement.js":
/*!*********************************!*\
  !*** ./src/HTMLAudioElement.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HTMLMediaElement2 = __webpack_require__(/*! ./HTMLMediaElement */ "./src/HTMLMediaElement.js");

var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLAudioElement = function (_HTMLMediaElement) {
    _inherits(HTMLAudioElement, _HTMLMediaElement);

    function HTMLAudioElement() {
        _classCallCheck(this, HTMLAudioElement);

        return _possibleConstructorReturn(this, (HTMLAudioElement.__proto__ || Object.getPrototypeOf(HTMLAudioElement)).call(this, "audio"));
    }

    return HTMLAudioElement;
}(_HTMLMediaElement3.default);

exports.default = HTMLAudioElement;

/***/ }),

/***/ "./src/HTMLCanvasElement.js":
/*!**********************************!*\
  !*** ./src/HTMLCanvasElement.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HTMLElement2 = __webpack_require__(/*! ./HTMLElement */ "./src/HTMLElement.js");

var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLCanvasElement = function (_HTMLElement) {
    _inherits(HTMLCanvasElement, _HTMLElement);

    function HTMLCanvasElement() {
        _classCallCheck(this, HTMLCanvasElement);

        return _possibleConstructorReturn(this, (HTMLCanvasElement.__proto__ || Object.getPrototypeOf(HTMLCanvasElement)).call(this, 'canvas'));
    }

    return HTMLCanvasElement;
}(_HTMLElement3.default);

exports.default = HTMLCanvasElement;
;

/***/ }),

/***/ "./src/HTMLElement.js":
/*!****************************!*\
  !*** ./src/HTMLElement.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Element2 = __webpack_require__(/*! ./Element */ "./src/Element.js");

var _Element3 = _interopRequireDefault(_Element2);

var _noop = __webpack_require__(/*! ./utils/noop */ "./src/utils/noop.js");

var _WindowProperties = __webpack_require__(/*! ./WindowProperties */ "./src/WindowProperties.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLElement = function (_Element) {
    _inherits(HTMLElement, _Element);

    function HTMLElement() {
        var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

        _classCallCheck(this, HTMLElement);

        var _this = _possibleConstructorReturn(this, (HTMLElement.__proto__ || Object.getPrototypeOf(HTMLElement)).call(this));

        _this.className = '';
        _this.childern = [];

        _this.style = {
            width: _WindowProperties.innerWidth + 'px',
            height: _WindowProperties.innerHeight + 'px'
        };

        _this.focus = _noop.noop;
        _this.blur = _noop.noop;

        _this.innerHTML = '';

        _this.tagName = tagName.toUpperCase();
        return _this;
    }

    return HTMLElement;
}(_Element3.default);

exports.default = HTMLElement;

/***/ }),

/***/ "./src/HTMLImageElement.js":
/*!*********************************!*\
  !*** ./src/HTMLImageElement.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HTMLElement2 = __webpack_require__(/*! ./HTMLElement */ "./src/HTMLElement.js");

var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLImageElement = function (_HTMLElement) {
    _inherits(HTMLImageElement, _HTMLElement);

    function HTMLImageElement() {
        _classCallCheck(this, HTMLImageElement);

        return _possibleConstructorReturn(this, (HTMLImageElement.__proto__ || Object.getPrototypeOf(HTMLImageElement)).call(this, "img"));
    }

    return HTMLImageElement;
}(_HTMLElement3.default);

exports.default = HTMLImageElement;
;

/***/ }),

/***/ "./src/HTMLMediaElement.js":
/*!*********************************!*\
  !*** ./src/HTMLMediaElement.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HTMLElement2 = __webpack_require__(/*! ./HTMLElement */ "./src/HTMLElement.js");

var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLMediaElement = function (_HTMLElement) {
    _inherits(HTMLMediaElement, _HTMLElement);

    function HTMLMediaElement(tagName) {
        var _this, _ret;

        _classCallCheck(this, HTMLMediaElement);

        return _ret = (_this = _possibleConstructorReturn(this, (HTMLMediaElement.__proto__ || Object.getPrototypeOf(HTMLMediaElement)).call(this, tagName)), _this), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(HTMLMediaElement, [{
        key: "addTextTrack",
        value: function addTextTrack() {}
    }, {
        key: "capureStream",
        value: function capureStream() {}
    }, {
        key: "fastSeek",
        value: function fastSeek() {}
    }, {
        key: "load",
        value: function load() {}
    }, {
        key: "pause",
        value: function pause() {}
    }, {
        key: "play",
        value: function play() {}
    }, {
        key: "canPlayType",
        value: function canPlayType() {}
    }]);

    return HTMLMediaElement;
}(_HTMLElement3.default);

exports.default = HTMLMediaElement;

/***/ }),

/***/ "./src/HTMLVideoElement.js":
/*!*********************************!*\
  !*** ./src/HTMLVideoElement.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HTMLMediaElement2 = __webpack_require__(/*! ./HTMLMediaElement */ "./src/HTMLMediaElement.js");

var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLVideoElement = function (_HTMLMediaElement) {
    _inherits(HTMLVideoElement, _HTMLMediaElement);

    function HTMLVideoElement() {
        _classCallCheck(this, HTMLVideoElement);

        return _possibleConstructorReturn(this, (HTMLVideoElement.__proto__ || Object.getPrototypeOf(HTMLVideoElement)).call(this, 'video'));
    }

    return HTMLVideoElement;
}(_HTMLMediaElement3.default);

exports.default = HTMLVideoElement;
;

/***/ }),

/***/ "./src/Image.js":
/*!**********************!*\
  !*** ./src/Image.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Image;

var _HTMLImageElement = __webpack_require__(/*! ./HTMLImageElement */ "./src/HTMLImageElement.js");

var _HTMLImageElement2 = _interopRequireDefault(_HTMLImageElement);

var _util = __webpack_require__(/*! ./utils/util */ "./src/utils/util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Image() {
    var image = my.createImage();
    if (!_util.isIDE) {
        image.__proto__ = new _HTMLImageElement2.default();
        if (image.tagName === undefined) {
            image.tagName = "IMG";
        }

        image.onload = function () {
            image.dispatchEvent({
                type: "load"
            });
        };

        image.onerror = function () {
            image.dispatchEvent({
                type: "error"
            });
        };
    }

    return image;
}

/***/ }),

/***/ "./src/ImageBitmap.js":
/*!****************************!*\
  !*** ./src/ImageBitmap.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageBitmap = function ImageBitmap() {
    // TODO

    _classCallCheck(this, ImageBitmap);
};

exports.default = ImageBitmap;

/***/ }),

/***/ "./src/Node.js":
/*!*********************!*\
  !*** ./src/Node.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventTarget2 = __webpack_require__(/*! ./EventTarget */ "./src/EventTarget.js");

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

var _noop = __webpack_require__(/*! ./utils/noop */ "./src/utils/noop.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = function (_EventTarget) {
  _inherits(Node, _EventTarget);

  function Node() {
    _classCallCheck(this, Node);

    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

    _this.childNodes = [];

    _this.insertBefore = _noop.noop;
    return _this;
  }

  _createClass(Node, [{
    key: 'appendChild',
    value: function appendChild(node) {
      if (node instanceof Node || node instanceof window.Node) {
        this.childNodes.push(node);
      } else {
        throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.');
      }
    }
  }, {
    key: 'cloneNode',
    value: function cloneNode() {
      var copyNode = Object.create(this);

      return Object.assign(copyNode, this);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(node) {
      var index = this.childNodes.findIndex(function (child) {
        return child === node;
      });

      if (index > -1) {
        return this.childNodes.splice(index, 1);
      }
      return null;
    }
  }]);

  return Node;
}(_EventTarget3.default);

exports.default = Node;

/***/ }),

/***/ "./src/Url.js":
/*!********************!*\
  !*** ./src/Url.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base = __webpack_require__(/*! ./Base64 */ "./src/Base64.js");

var _Blob = __webpack_require__(/*! ./Blob */ "./src/Blob.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = function () {
  _createClass(URL, null, [{
    key: "createObjectURL",

    /**
     * fake createObject, use base64 instead
     * @param blob
     */
    value: function createObjectURL(blob) {
      var buffer = blob.buffers[0];
      var type = blob.type;
      var base64 = _arrayBufferToBase64(buffer);
      var prefix = "data:" + type + ";base64,";
      return prefix + base64;
    }

    // todo: 完善URL对象

  }]);

  function URL(url) {
    var host = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    _classCallCheck(this, URL);

    if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
      this._href = url;
      return;
    }
    this._href = host + url;
  }

  _createClass(URL, [{
    key: "href",
    get: function get() {
      return this._href;
    }
  }]);

  return URL;
}();

exports.default = URL;


function _arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return (0, _Base.btoa)(binary);
}

/***/ }),

/***/ "./src/WebGLRenderingContext.js":
/*!**************************************!*\
  !*** ./src/WebGLRenderingContext.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebGLRenderingContext = function WebGLRenderingContext() {
    // TODO

    _classCallCheck(this, WebGLRenderingContext);
};

exports.default = WebGLRenderingContext;


var GL_CONSTANTS = {
    GCCSO_SHADER_BINARY_FJ: 0x9260,
    _3DC_XY_AMD: 0x87fa,
    _3DC_X_AMD: 0x87f9,
    ACTIVE_ATTRIBUTES: 0x8b89,
    ACTIVE_ATTRIBUTE_MAX_LENGTH: 0x8b8a,
    ACTIVE_PROGRAM_EXT: 0x8259,
    ACTIVE_TEXTURE: 0x84e0,
    ACTIVE_UNIFORMS: 0x8b86,
    ACTIVE_UNIFORM_MAX_LENGTH: 0x8b87,
    ALIASED_LINE_WIDTH_RANGE: 0x846e,
    ALIASED_POINT_SIZE_RANGE: 0x846d,
    ALL_COMPLETED_NV: 0x84f2,
    ALL_SHADER_BITS_EXT: 0xffffffff,
    ALPHA: 0x1906,
    ALPHA16F_EXT: 0x881c,
    ALPHA32F_EXT: 0x8816,
    ALPHA8_EXT: 0x803c,
    ALPHA8_OES: 0x803c,
    ALPHA_BITS: 0xd55,
    ALPHA_TEST_FUNC_QCOM: 0xbc1,
    ALPHA_TEST_QCOM: 0xbc0,
    ALPHA_TEST_REF_QCOM: 0xbc2,
    ALREADY_SIGNALED_APPLE: 0x911a,
    ALWAYS: 0x207,
    AMD_compressed_3DC_texture: 0x1,
    AMD_compressed_ATC_texture: 0x1,
    AMD_performance_monitor: 0x1,
    AMD_program_binary_Z400: 0x1,
    ANGLE_depth_texture: 0x1,
    ANGLE_framebuffer_blit: 0x1,
    ANGLE_framebuffer_multisample: 0x1,
    ANGLE_instanced_arrays: 0x1,
    ANGLE_pack_reverse_row_order: 0x1,
    ANGLE_program_binary: 0x1,
    ANGLE_texture_compression_dxt3: 0x1,
    ANGLE_texture_compression_dxt5: 0x1,
    ANGLE_texture_usage: 0x1,
    ANGLE_translated_shader_source: 0x1,
    ANY_SAMPLES_PASSED_CONSERVATIVE_EXT: 0x8d6a,
    ANY_SAMPLES_PASSED_EXT: 0x8c2f,
    APPLE_copy_texture_levels: 0x1,
    APPLE_framebuffer_multisample: 0x1,
    APPLE_rgb_422: 0x1,
    APPLE_sync: 0x1,
    APPLE_texture_format_BGRA8888: 0x1,
    APPLE_texture_max_level: 0x1,
    ARM_mali_program_binary: 0x1,
    ARM_mali_shader_binary: 0x1,
    ARM_rgba8: 0x1,
    ARRAY_BUFFER: 0x8892,
    ARRAY_BUFFER_BINDING: 0x8894,
    ATC_RGBA_EXPLICIT_ALPHA_AMD: 0x8c93,
    ATC_RGBA_INTERPOLATED_ALPHA_AMD: 0x87ee,
    ATC_RGB_AMD: 0x8c92,
    ATTACHED_SHADERS: 0x8b85,
    BACK: 0x405,
    BGRA8_EXT: 0x93a1,
    BGRA_EXT: 0x80e1,
    BGRA_IMG: 0x80e1,
    BINNING_CONTROL_HINT_QCOM: 0x8fb0,
    BLEND: 0xbe2,
    BLEND_COLOR: 0x8005,
    BLEND_DST_ALPHA: 0x80ca,
    BLEND_DST_RGB: 0x80c8,
    BLEND_EQUATION: 0x8009,
    BLEND_EQUATION_ALPHA: 0x883d,
    BLEND_EQUATION_RGB: 0x8009,
    BLEND_SRC_ALPHA: 0x80cb,
    BLEND_SRC_RGB: 0x80c9,
    BLUE_BITS: 0xd54,
    BOOL: 0x8b56,
    BOOL_VEC2: 0x8b57,
    BOOL_VEC3: 0x8b58,
    BOOL_VEC4: 0x8b59,
    BUFFER: 0x82e0,
    BUFFER_ACCESS_OES: 0x88bb,
    BUFFER_MAPPED_OES: 0x88bc,
    BUFFER_MAP_POINTER_OES: 0x88bd,
    BUFFER_OBJECT_EXT: 0x9151,
    BUFFER_SIZE: 0x8764,
    BUFFER_USAGE: 0x8765,
    BYTE: 0x1400,
    CCW: 0x901,
    CLAMP_TO_BORDER_NV: 0x812d,
    CLAMP_TO_EDGE: 0x812f,
    COLOR_ATTACHMENT0: 0x8ce0,
    COLOR_ATTACHMENT0_NV: 0x8ce0,
    COLOR_ATTACHMENT10_NV: 0x8cea,
    COLOR_ATTACHMENT11_NV: 0x8ceb,
    COLOR_ATTACHMENT12_NV: 0x8cec,
    COLOR_ATTACHMENT13_NV: 0x8ced,
    COLOR_ATTACHMENT14_NV: 0x8cee,
    COLOR_ATTACHMENT15_NV: 0x8cef,
    COLOR_ATTACHMENT1_NV: 0x8ce1,
    COLOR_ATTACHMENT2_NV: 0x8ce2,
    COLOR_ATTACHMENT3_NV: 0x8ce3,
    COLOR_ATTACHMENT4_NV: 0x8ce4,
    COLOR_ATTACHMENT5_NV: 0x8ce5,
    COLOR_ATTACHMENT6_NV: 0x8ce6,
    COLOR_ATTACHMENT7_NV: 0x8ce7,
    COLOR_ATTACHMENT8_NV: 0x8ce8,
    COLOR_ATTACHMENT9_NV: 0x8ce9,
    COLOR_ATTACHMENT_EXT: 0x90f0,
    COLOR_BUFFER_BIT: 0x4000,
    COLOR_BUFFER_BIT0_QCOM: 0x1,
    COLOR_BUFFER_BIT1_QCOM: 0x2,
    COLOR_BUFFER_BIT2_QCOM: 0x4,
    COLOR_BUFFER_BIT3_QCOM: 0x8,
    COLOR_BUFFER_BIT4_QCOM: 0x10,
    COLOR_BUFFER_BIT5_QCOM: 0x20,
    COLOR_BUFFER_BIT6_QCOM: 0x40,
    COLOR_BUFFER_BIT7_QCOM: 0x80,
    COLOR_CLEAR_VALUE: 0xc22,
    COLOR_EXT: 0x1800,
    COLOR_WRITEMASK: 0xc23,
    COMPARE_REF_TO_TEXTURE_EXT: 0x884e,
    COMPILE_STATUS: 0x8b81,
    COMPRESSED_RGBA_ASTC_10x10_KHR: 0x93bb,
    COMPRESSED_RGBA_ASTC_10x5_KHR: 0x93b8,
    COMPRESSED_RGBA_ASTC_10x6_KHR: 0x93b9,
    COMPRESSED_RGBA_ASTC_10x8_KHR: 0x93ba,
    COMPRESSED_RGBA_ASTC_12x10_KHR: 0x93bc,
    COMPRESSED_RGBA_ASTC_12x12_KHR: 0x93bd,
    COMPRESSED_RGBA_ASTC_4x4_KHR: 0x93b0,
    COMPRESSED_RGBA_ASTC_5x4_KHR: 0x93b1,
    COMPRESSED_RGBA_ASTC_5x5_KHR: 0x93b2,
    COMPRESSED_RGBA_ASTC_6x5_KHR: 0x93b3,
    COMPRESSED_RGBA_ASTC_6x6_KHR: 0x93b4,
    COMPRESSED_RGBA_ASTC_8x5_KHR: 0x93b5,
    COMPRESSED_RGBA_ASTC_8x6_KHR: 0x93b6,
    COMPRESSED_RGBA_ASTC_8x8_KHR: 0x93b7,
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8c03,
    COMPRESSED_RGBA_PVRTC_2BPPV2_IMG: 0x9137,
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8c02,
    COMPRESSED_RGBA_PVRTC_4BPPV2_IMG: 0x9138,
    COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83f1,
    COMPRESSED_RGBA_S3TC_DXT3_ANGLE: 0x83f2,
    COMPRESSED_RGBA_S3TC_DXT5_ANGLE: 0x83f3,
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8c01,
    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8c00,
    COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83f0,
    COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR: 0x93db,
    COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR: 0x93d8,
    COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR: 0x93d9,
    COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR: 0x93da,
    COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR: 0x93dc,
    COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR: 0x93dd,
    COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR: 0x93d0,
    COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR: 0x93d1,
    COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR: 0x93d2,
    COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR: 0x93d3,
    COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR: 0x93d4,
    COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR: 0x93d5,
    COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR: 0x93d6,
    COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR: 0x93d7,
    COMPRESSED_SRGB_ALPHA_S3TC_DXT1_NV: 0x8c4d,
    COMPRESSED_SRGB_ALPHA_S3TC_DXT3_NV: 0x8c4e,
    COMPRESSED_SRGB_ALPHA_S3TC_DXT5_NV: 0x8c4f,
    COMPRESSED_SRGB_S3TC_DXT1_NV: 0x8c4c,
    COMPRESSED_TEXTURE_FORMATS: 0x86a3,
    CONDITION_SATISFIED_APPLE: 0x911c,
    CONSTANT_ALPHA: 0x8003,
    CONSTANT_COLOR: 0x8001,
    CONTEXT_FLAG_DEBUG_BIT: 0x2,
    CONTEXT_ROBUST_ACCESS_EXT: 0x90f3,
    COUNTER_RANGE_AMD: 0x8bc1,
    COUNTER_TYPE_AMD: 0x8bc0,
    COVERAGE_ALL_FRAGMENTS_NV: 0x8ed5,
    COVERAGE_ATTACHMENT_NV: 0x8ed2,
    COVERAGE_AUTOMATIC_NV: 0x8ed7,
    COVERAGE_BUFFERS_NV: 0x8ed3,
    COVERAGE_BUFFER_BIT_NV: 0x8000,
    COVERAGE_COMPONENT4_NV: 0x8ed1,
    COVERAGE_COMPONENT_NV: 0x8ed0,
    COVERAGE_EDGE_FRAGMENTS_NV: 0x8ed6,
    COVERAGE_SAMPLES_NV: 0x8ed4,
    CPU_OPTIMIZED_QCOM: 0x8fb1,
    CULL_FACE: 0xb44,
    CULL_FACE_MODE: 0xb45,
    CURRENT_PROGRAM: 0x8b8d,
    CURRENT_QUERY_EXT: 0x8865,
    CURRENT_VERTEX_ATTRIB: 0x8626,
    CW: 0x900,
    DEBUG_CALLBACK_FUNCTION: 0x8244,
    DEBUG_CALLBACK_USER_PARAM: 0x8245,
    DEBUG_GROUP_STACK_DEPTH: 0x826d,
    DEBUG_LOGGED_MESSAGES: 0x9145,
    DEBUG_NEXT_LOGGED_MESSAGE_LENGTH: 0x8243,
    DEBUG_OUTPUT: 0x92e0,
    DEBUG_OUTPUT_SYNCHRONOUS: 0x8242,
    DEBUG_SEVERITY_HIGH: 0x9146,
    DEBUG_SEVERITY_LOW: 0x9148,
    DEBUG_SEVERITY_MEDIUM: 0x9147,
    DEBUG_SEVERITY_NOTIFICATION: 0x826b,
    DEBUG_SOURCE_API: 0x8246,
    DEBUG_SOURCE_APPLICATION: 0x824a,
    DEBUG_SOURCE_OTHER: 0x824b,
    DEBUG_SOURCE_SHADER_COMPILER: 0x8248,
    DEBUG_SOURCE_THIRD_PARTY: 0x8249,
    DEBUG_SOURCE_WINDOW_SYSTEM: 0x8247,
    DEBUG_TYPE_DEPRECATED_BEHAVIOR: 0x824d,
    DEBUG_TYPE_ERROR: 0x824c,
    DEBUG_TYPE_MARKER: 0x8268,
    DEBUG_TYPE_OTHER: 0x8251,
    DEBUG_TYPE_PERFORMANCE: 0x8250,
    DEBUG_TYPE_POP_GROUP: 0x826a,
    DEBUG_TYPE_PORTABILITY: 0x824f,
    DEBUG_TYPE_PUSH_GROUP: 0x8269,
    DEBUG_TYPE_UNDEFINED_BEHAVIOR: 0x824e,
    DECR: 0x1e03,
    DECR_WRAP: 0x8508,
    DELETE_STATUS: 0x8b80,
    DEPTH24_STENCIL8_OES: 0x88f0,
    DEPTH_ATTACHMENT: 0x8d00,
    DEPTH_STENCIL_ATTACHMENT: 0x821a,
    DEPTH_BITS: 0xd56,
    DEPTH_BUFFER_BIT: 0x100,
    DEPTH_BUFFER_BIT0_QCOM: 0x100,
    DEPTH_BUFFER_BIT1_QCOM: 0x200,
    DEPTH_BUFFER_BIT2_QCOM: 0x400,
    DEPTH_BUFFER_BIT3_QCOM: 0x800,
    DEPTH_BUFFER_BIT4_QCOM: 0x1000,
    DEPTH_BUFFER_BIT5_QCOM: 0x2000,
    DEPTH_BUFFER_BIT6_QCOM: 0x4000,
    DEPTH_BUFFER_BIT7_QCOM: 0x8000,
    DEPTH_CLEAR_VALUE: 0xb73,
    DEPTH_COMPONENT: 0x1902,
    DEPTH_COMPONENT16: 0x81a5,
    DEPTH_COMPONENT16_NONLINEAR_NV: 0x8e2c,
    DEPTH_COMPONENT16_OES: 0x81a5,
    DEPTH_COMPONENT24_OES: 0x81a6,
    DEPTH_COMPONENT32_OES: 0x81a7,
    DEPTH_EXT: 0x1801,
    DEPTH_FUNC: 0xb74,
    DEPTH_RANGE: 0xb70,
    DEPTH_STENCIL: 0x84f9,
    DEPTH_STENCIL_OES: 0x84f9,
    DEPTH_TEST: 0xb71,
    DEPTH_WRITEMASK: 0xb72,
    DITHER: 0xbd0,
    DMP_shader_binary: 0x1,
    DONT_CARE: 0x1100,
    DRAW_BUFFER0_NV: 0x8825,
    DRAW_BUFFER10_NV: 0x882f,
    DRAW_BUFFER11_NV: 0x8830,
    DRAW_BUFFER12_NV: 0x8831,
    DRAW_BUFFER13_NV: 0x8832,
    DRAW_BUFFER14_NV: 0x8833,
    DRAW_BUFFER15_NV: 0x8834,
    DRAW_BUFFER1_NV: 0x8826,
    DRAW_BUFFER2_NV: 0x8827,
    DRAW_BUFFER3_NV: 0x8828,
    DRAW_BUFFER4_NV: 0x8829,
    DRAW_BUFFER5_NV: 0x882a,
    DRAW_BUFFER6_NV: 0x882b,
    DRAW_BUFFER7_NV: 0x882c,
    DRAW_BUFFER8_NV: 0x882d,
    DRAW_BUFFER9_NV: 0x882e,
    DRAW_BUFFER_EXT: 0xc01,
    DRAW_FRAMEBUFFER_ANGLE: 0x8ca9,
    DRAW_FRAMEBUFFER_APPLE: 0x8ca9,
    DRAW_FRAMEBUFFER_BINDING_ANGLE: 0x8ca6,
    DRAW_FRAMEBUFFER_BINDING_APPLE: 0x8ca6,
    DRAW_FRAMEBUFFER_BINDING_NV: 0x8ca6,
    DRAW_FRAMEBUFFER_NV: 0x8ca9,
    DST_ALPHA: 0x304,
    DST_COLOR: 0x306,
    DYNAMIC_DRAW: 0x88e8,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    ELEMENT_ARRAY_BUFFER_BINDING: 0x8895,
    EQUAL: 0x202,
    ES_VERSION_2_0: 0x1,
    ETC1_RGB8_OES: 0x8d64,
    ETC1_SRGB8_NV: 0x88ee,
    EXTENSIONS: 0x1f03,
    EXT_blend_minmax: 0x1,
    EXT_color_buffer_half_float: 0x1,
    EXT_debug_label: 0x1,
    EXT_debug_marker: 0x1,
    EXT_discard_framebuffer: 0x1,
    EXT_map_buffer_range: 0x1,
    EXT_multi_draw_arrays: 0x1,
    EXT_multisampled_render_to_texture: 0x1,
    EXT_multiview_draw_buffers: 0x1,
    EXT_occlusion_query_boolean: 0x1,
    EXT_read_format_bgra: 0x1,
    EXT_robustness: 0x1,
    EXT_sRGB: 0x1,
    EXT_separate_shader_objects: 0x1,
    EXT_shader_framebuffer_fetch: 0x1,
    EXT_shader_texture_lod: 0x1,
    EXT_shadow_samplers: 0x1,
    EXT_texture_compression_dxt1: 0x1,
    EXT_texture_filter_anisotropic: 0x1,
    EXT_texture_format_BGRA8888: 0x1,
    EXT_texture_rg: 0x1,
    EXT_texture_storage: 0x1,
    EXT_texture_type_2_10_10_10_REV: 0x1,
    EXT_unpack_subimage: 0x1,
    FALSE: 0x0,
    FASTEST: 0x1101,
    FENCE_CONDITION_NV: 0x84f4,
    FENCE_STATUS_NV: 0x84f3,
    FIXED: 0x140c,
    FJ_shader_binary_GCCSO: 0x1,
    FLOAT: 0x1406,
    FLOAT_MAT2: 0x8b5a,
    FLOAT_MAT3: 0x8b5b,
    FLOAT_MAT4: 0x8b5c,
    FLOAT_VEC2: 0x8b50,
    FLOAT_VEC3: 0x8b51,
    FLOAT_VEC4: 0x8b52,
    FRAGMENT_SHADER: 0x8b30,
    FRAGMENT_SHADER_BIT_EXT: 0x2,
    FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 0x8b8b,
    FRAGMENT_SHADER_DISCARDS_SAMPLES_EXT: 0x8a52,
    FRAMEBUFFER: 0x8d40,
    FRAMEBUFFER_ATTACHMENT_ANGLE: 0x93a3,
    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 0x8210,
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 0x8211,
    FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8cd1,
    FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8cd0,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_3D_ZOFFSET_OES: 0x8cd4,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8cd3,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8cd2,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_SAMPLES_EXT: 0x8d6c,
    FRAMEBUFFER_BINDING: 0x8ca6,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8cd9,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8cd7,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_ANGLE: 0x8d56,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_APPLE: 0x8d56,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_EXT: 0x8d56,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_IMG: 0x9134,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_NV: 0x8d56,
    FRAMEBUFFER_UNDEFINED_OES: 0x8219,
    FRAMEBUFFER_UNSUPPORTED: 0x8cdd,
    FRONT: 0x404,
    FRONT_AND_BACK: 0x408,
    FRONT_FACE: 0xb46,
    FUNC_ADD: 0x8006,
    FUNC_REVERSE_SUBTRACT: 0x800b,
    FUNC_SUBTRACT: 0x800a,
    GENERATE_MIPMAP_HINT: 0x8192,
    GEQUAL: 0x206,
    GPU_OPTIMIZED_QCOM: 0x8fb2,
    GREATER: 0x204,
    GREEN_BITS: 0xd53,
    GUILTY_CONTEXT_RESET_EXT: 0x8253,
    HALF_FLOAT_OES: 0x8d61,
    HIGH_FLOAT: 0x8df2,
    HIGH_INT: 0x8df5,
    IMG_multisampled_render_to_texture: 0x1,
    IMG_program_binary: 0x1,
    IMG_read_format: 0x1,
    IMG_shader_binary: 0x1,
    IMG_texture_compression_pvrtc: 0x1,
    IMG_texture_compression_pvrtc2: 0x1,
    IMPLEMENTATION_COLOR_READ_FORMAT: 0x8b9b,
    IMPLEMENTATION_COLOR_READ_TYPE: 0x8b9a,
    INCR: 0x1e02,
    INCR_WRAP: 0x8507,
    INFO_LOG_LENGTH: 0x8b84,
    INNOCENT_CONTEXT_RESET_EXT: 0x8254,
    INT: 0x1404,
    INT_10_10_10_2_OES: 0x8df7,
    INT_VEC2: 0x8b53,
    INT_VEC3: 0x8b54,
    INT_VEC4: 0x8b55,
    INVALID_ENUM: 0x500,
    INVALID_FRAMEBUFFER_OPERATION: 0x506,
    INVALID_OPERATION: 0x502,
    INVALID_VALUE: 0x501,
    INVERT: 0x150a,
    KEEP: 0x1e00,
    KHR_debug: 0x1,
    KHR_texture_compression_astc_ldr: 0x1,
    LEFT: 0x0406,
    LEQUAL: 0x203,
    LESS: 0x201,
    LINEAR: 0x2601,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    LINES: 0x1,
    LINE_LOOP: 0x2,
    LINE_STRIP: 0x3,
    LINE_WIDTH: 0xb21,
    LINK_STATUS: 0x8b82,
    LOSE_CONTEXT_ON_RESET_EXT: 0x8252,
    LOW_FLOAT: 0x8df0,
    LOW_INT: 0x8df3,
    LUMINANCE: 0x1909,
    LUMINANCE16F_EXT: 0x881e,
    LUMINANCE32F_EXT: 0x8818,
    LUMINANCE4_ALPHA4_OES: 0x8043,
    LUMINANCE8_ALPHA8_EXT: 0x8045,
    LUMINANCE8_ALPHA8_OES: 0x8045,
    LUMINANCE8_EXT: 0x8040,
    LUMINANCE8_OES: 0x8040,
    LUMINANCE_ALPHA: 0x190a,
    LUMINANCE_ALPHA16F_EXT: 0x881f,
    LUMINANCE_ALPHA32F_EXT: 0x8819,
    MALI_PROGRAM_BINARY_ARM: 0x8f61,
    MALI_SHADER_BINARY_ARM: 0x8f60,
    MAP_FLUSH_EXPLICIT_BIT_EXT: 0x10,
    MAP_INVALIDATE_BUFFER_BIT_EXT: 0x8,
    MAP_INVALIDATE_RANGE_BIT_EXT: 0x4,
    MAP_READ_BIT_EXT: 0x1,
    MAP_UNSYNCHRONIZED_BIT_EXT: 0x20,
    MAP_WRITE_BIT_EXT: 0x2,
    MAX_3D_TEXTURE_SIZE_OES: 0x8073,
    MAX_COLOR_ATTACHMENTS_NV: 0x8cdf,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d,
    MAX_CUBE_MAP_TEXTURE_SIZE: 0x851c,
    MAX_DEBUG_GROUP_STACK_DEPTH: 0x826c,
    MAX_DEBUG_LOGGED_MESSAGES: 0x9144,
    MAX_DEBUG_MESSAGE_LENGTH: 0x9143,
    MAX_DRAW_BUFFERS_NV: 0x8824,
    MAX_EXT: 0x8008,
    MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    MAX_LABEL_LENGTH: 0x82e8,
    MAX_MULTIVIEW_BUFFERS_EXT: 0x90f2,
    MAX_RENDERBUFFER_SIZE: 0x84e8,
    MAX_SAMPLES_ANGLE: 0x8d57,
    MAX_SAMPLES_APPLE: 0x8d57,
    MAX_SAMPLES_EXT: 0x8d57,
    MAX_SAMPLES_IMG: 0x9135,
    MAX_SAMPLES_NV: 0x8d57,
    MAX_SERVER_WAIT_TIMEOUT_APPLE: 0x9111,
    MAX_TEXTURE_IMAGE_UNITS: 0x8872,
    MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff,
    MAX_TEXTURE_SIZE: 0xd33,
    MAX_VARYING_VECTORS: 0x8dfc,
    MAX_VERTEX_ATTRIBS: 0x8869,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8b4c,
    MAX_VERTEX_UNIFORM_VECTORS: 0x8dfb,
    MAX_VIEWPORT_DIMS: 0xd3a,
    MEDIUM_FLOAT: 0x8df1,
    MEDIUM_INT: 0x8df4,
    MIN_EXT: 0x8007,
    MIRRORED_REPEAT: 0x8370,
    MULTISAMPLE_BUFFER_BIT0_QCOM: 0x1000000,
    MULTISAMPLE_BUFFER_BIT1_QCOM: 0x2000000,
    MULTISAMPLE_BUFFER_BIT2_QCOM: 0x4000000,
    MULTISAMPLE_BUFFER_BIT3_QCOM: 0x8000000,
    MULTISAMPLE_BUFFER_BIT4_QCOM: 0x10000000,
    MULTISAMPLE_BUFFER_BIT5_QCOM: 0x20000000,
    MULTISAMPLE_BUFFER_BIT6_QCOM: 0x40000000,
    MULTISAMPLE_BUFFER_BIT7_QCOM: 0x80000000,
    MULTIVIEW_EXT: 0x90f1,
    NEAREST: 0x2600,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    NEAREST_MIPMAP_NEAREST: 0x2700,
    NEVER: 0x200,
    NICEST: 0x1102,
    NONE: 0x0,
    NOTEQUAL: 0x205,
    NO_ERROR: 0x0,
    NO_RESET_NOTIFICATION_EXT: 0x8261,
    NUM_COMPRESSED_TEXTURE_FORMATS: 0x86a2,
    NUM_PROGRAM_BINARY_FORMATS_OES: 0x87fe,
    NUM_SHADER_BINARY_FORMATS: 0x8df9,
    NV_coverage_sample: 0x1,
    NV_depth_nonlinear: 0x1,
    NV_draw_buffers: 0x1,
    NV_draw_instanced: 0x1,
    NV_fbo_color_attachments: 0x1,
    NV_fence: 0x1,
    NV_framebuffer_blit: 0x1,
    NV_framebuffer_multisample: 0x1,
    NV_generate_mipmap_sRGB: 0x1,
    NV_instanced_arrays: 0x1,
    NV_read_buffer: 0x1,
    NV_read_buffer_front: 0x1,
    NV_read_depth: 0x1,
    NV_read_depth_stencil: 0x1,
    NV_read_stencil: 0x1,
    NV_sRGB_formats: 0x1,
    NV_shadow_samplers_array: 0x1,
    NV_shadow_samplers_cube: 0x1,
    NV_texture_border_clamp: 0x1,
    NV_texture_compression_s3tc_update: 0x1,
    NV_texture_npot_2D_mipmap: 0x1,
    OBJECT_TYPE_APPLE: 0x9112,
    OES_EGL_image: 0x1,
    OES_EGL_image_external: 0x1,
    OES_compressed_ETC1_RGB8_texture: 0x1,
    OES_compressed_paletted_texture: 0x1,
    OES_depth24: 0x1,
    OES_depth32: 0x1,
    OES_depth_texture: 0x1,
    OES_element_index_uint: 0x1,
    OES_fbo_render_mipmap: 0x1,
    OES_fragment_precision_high: 0x1,
    OES_get_program_binary: 0x1,
    OES_mapbuffer: 0x1,
    OES_packed_depth_stencil: 0x1,
    OES_required_internalformat: 0x1,
    OES_rgb8_rgba8: 0x1,
    OES_standard_derivatives: 0x1,
    OES_stencil1: 0x1,
    OES_stencil4: 0x1,
    OES_surfaceless_context: 0x1,
    OES_texture_3D: 0x1,
    OES_texture_float: 0x1,
    OES_texture_float_linear: 0x1,
    OES_texture_half_float: 0x1,
    OES_texture_half_float_linear: 0x1,
    OES_texture_npot: 0x1,
    OES_vertex_array_object: 0x1,
    OES_vertex_half_float: 0x1,
    OES_vertex_type_10_10_10_2: 0x1,
    ONE: 0x1,
    ONE_MINUS_CONSTANT_ALPHA: 0x8004,
    ONE_MINUS_CONSTANT_COLOR: 0x8002,
    ONE_MINUS_DST_ALPHA: 0x305,
    ONE_MINUS_DST_COLOR: 0x307,
    ONE_MINUS_SRC_ALPHA: 0x303,
    ONE_MINUS_SRC_COLOR: 0x301,
    OUT_OF_MEMORY: 0x505,
    PACK_ALIGNMENT: 0xd05,
    PACK_REVERSE_ROW_ORDER_ANGLE: 0x93a4,
    PALETTE4_R5_G6_B5_OES: 0x8b92,
    PALETTE4_RGB5_A1_OES: 0x8b94,
    PALETTE4_RGB8_OES: 0x8b90,
    PALETTE4_RGBA4_OES: 0x8b93,
    PALETTE4_RGBA8_OES: 0x8b91,
    PALETTE8_R5_G6_B5_OES: 0x8b97,
    PALETTE8_RGB5_A1_OES: 0x8b99,
    PALETTE8_RGB8_OES: 0x8b95,
    PALETTE8_RGBA4_OES: 0x8b98,
    PALETTE8_RGBA8_OES: 0x8b96,
    PERCENTAGE_AMD: 0x8bc3,
    PERFMON_GLOBAL_MODE_QCOM: 0x8fa0,
    PERFMON_RESULT_AMD: 0x8bc6,
    PERFMON_RESULT_AVAILABLE_AMD: 0x8bc4,
    PERFMON_RESULT_SIZE_AMD: 0x8bc5,
    POINTS: 0x0,
    POLYGON_OFFSET_FACTOR: 0x8038,
    POLYGON_OFFSET_FILL: 0x8037,
    POLYGON_OFFSET_UNITS: 0x2a00,
    PROGRAM: 0x82e2,
    PROGRAM_BINARY_ANGLE: 0x93a6,
    PROGRAM_BINARY_FORMATS_OES: 0x87ff,
    PROGRAM_BINARY_LENGTH_OES: 0x8741,
    PROGRAM_OBJECT_EXT: 0x8b40,
    PROGRAM_PIPELINE_BINDING_EXT: 0x825a,
    PROGRAM_PIPELINE_OBJECT_EXT: 0x8a4f,
    PROGRAM_SEPARABLE_EXT: 0x8258,
    QCOM_alpha_test: 0x1,
    QCOM_binning_control: 0x1,
    QCOM_driver_control: 0x1,
    QCOM_extended_get: 0x1,
    QCOM_extended_get2: 0x1,
    QCOM_perfmon_global_mode: 0x1,
    QCOM_tiled_rendering: 0x1,
    QCOM_writeonly_rendering: 0x1,
    QUERY: 0x82e3,
    QUERY_OBJECT_EXT: 0x9153,
    QUERY_RESULT_AVAILABLE_EXT: 0x8867,
    QUERY_RESULT_EXT: 0x8866,
    R16F_EXT: 0x822d,
    R32F_EXT: 0x822e,
    R8_EXT: 0x8229,
    READ_BUFFER_EXT: 0xc02,
    READ_BUFFER_NV: 0xc02,
    READ_FRAMEBUFFER_ANGLE: 0x8ca8,
    READ_FRAMEBUFFER_APPLE: 0x8ca8,
    READ_FRAMEBUFFER_BINDING_ANGLE: 0x8caa,
    READ_FRAMEBUFFER_BINDING_APPLE: 0x8caa,
    READ_FRAMEBUFFER_BINDING_NV: 0x8caa,
    READ_FRAMEBUFFER_NV: 0x8ca8,
    RED_BITS: 0xd52,
    RED_EXT: 0x1903,
    RENDERBUFFER: 0x8d41,
    RENDERBUFFER_ALPHA_SIZE: 0x8d53,
    RENDERBUFFER_BINDING: 0x8ca7,
    RENDERBUFFER_BLUE_SIZE: 0x8d52,
    RENDERBUFFER_DEPTH_SIZE: 0x8d54,
    RENDERBUFFER_GREEN_SIZE: 0x8d51,
    RENDERBUFFER_HEIGHT: 0x8d43,
    RENDERBUFFER_INTERNAL_FORMAT: 0x8d44,
    RENDERBUFFER_RED_SIZE: 0x8d50,
    RENDERBUFFER_SAMPLES_ANGLE: 0x8cab,
    RENDERBUFFER_SAMPLES_APPLE: 0x8cab,
    RENDERBUFFER_SAMPLES_EXT: 0x8cab,
    RENDERBUFFER_SAMPLES_IMG: 0x9133,
    RENDERBUFFER_SAMPLES_NV: 0x8cab,
    RENDERBUFFER_STENCIL_SIZE: 0x8d55,
    RENDERBUFFER_WIDTH: 0x8d42,
    RENDERER: 0x1f01,
    RENDER_DIRECT_TO_FRAMEBUFFER_QCOM: 0x8fb3,
    REPEAT: 0x2901,
    REPLACE: 0x1e01,
    REQUIRED_TEXTURE_IMAGE_UNITS_OES: 0x8d68,
    RESET_NOTIFICATION_STRATEGY_EXT: 0x8256,
    RG16F_EXT: 0x822f,
    RG32F_EXT: 0x8230,
    RG8_EXT: 0x822b,
    RGB: 0x1907,
    RGB10_A2_EXT: 0x8059,
    RGB10_EXT: 0x8052,
    RGB16F_EXT: 0x881b,
    RGB32F_EXT: 0x8815,
    RGB565: 0x8d62,
    RGB565_OES: 0x8d62,
    RGB5_A1: 0x8057,
    RGB5_A1_OES: 0x8057,
    RGB8_OES: 0x8051,
    RGBA: 0x1908,
    RGBA16F_EXT: 0x881a,
    RGBA32F_EXT: 0x8814,
    RGBA4: 0x8056,
    RGBA4_OES: 0x8056,
    RGBA8_OES: 0x8058,
    RGB_422_APPLE: 0x8a1f,
    RG_EXT: 0x8227,
    RIGHT: 0x0407,
    SAMPLER: 0x82e6,
    SAMPLER_2D: 0x8b5e,
    SAMPLER_2D_ARRAY_SHADOW_NV: 0x8dc4,
    SAMPLER_2D_SHADOW_EXT: 0x8b62,
    SAMPLER_3D_OES: 0x8b5f,
    SAMPLER_CUBE: 0x8b60,
    SAMPLER_CUBE_SHADOW_NV: 0x8dc5,
    SAMPLER_EXTERNAL_OES: 0x8d66,
    SAMPLES: 0x80a9,
    SAMPLE_ALPHA_TO_COVERAGE: 0x809e,
    SAMPLE_BUFFERS: 0x80a8,
    SAMPLE_COVERAGE: 0x80a0,
    SAMPLE_COVERAGE_INVERT: 0x80ab,
    SAMPLE_COVERAGE_VALUE: 0x80aa,
    SCISSOR_BOX: 0xc10,
    SCISSOR_TEST: 0xc11,
    SGX_BINARY_IMG: 0x8c0a,
    SGX_PROGRAM_BINARY_IMG: 0x9130,
    SHADER: 0x82e1,
    SHADER_BINARY_DMP: 0x9250,
    SHADER_BINARY_FORMATS: 0x8df8,
    SHADER_BINARY_VIV: 0x8fc4,
    SHADER_COMPILER: 0x8dfa,
    SHADER_OBJECT_EXT: 0x8b48,
    SHADER_SOURCE_LENGTH: 0x8b88,
    SHADER_TYPE: 0x8b4f,
    SHADING_LANGUAGE_VERSION: 0x8b8c,
    SHORT: 0x1402,
    SIGNALED_APPLE: 0x9119,
    SLUMINANCE8_ALPHA8_NV: 0x8c45,
    SLUMINANCE8_NV: 0x8c47,
    SLUMINANCE_ALPHA_NV: 0x8c44,
    SLUMINANCE_NV: 0x8c46,
    SRC_ALPHA: 0x302,
    SRC_ALPHA_SATURATE: 0x308,
    SRC_COLOR: 0x300,
    SRGB8_ALPHA8_EXT: 0x8c43,
    SRGB8_NV: 0x8c41,
    SRGB_ALPHA_EXT: 0x8c42,
    SRGB_EXT: 0x8c40,
    STACK_OVERFLOW: 0x503,
    STACK_UNDERFLOW: 0x504,
    STATE_RESTORE: 0x8bdc,
    STATIC_DRAW: 0x88e4,
    STENCIL_ATTACHMENT: 0x8d20,
    STENCIL_BACK_FAIL: 0x8801,
    STENCIL_BACK_FUNC: 0x8800,
    STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802,
    STENCIL_BACK_PASS_DEPTH_PASS: 0x8803,
    STENCIL_BACK_REF: 0x8ca3,
    STENCIL_BACK_VALUE_MASK: 0x8ca4,
    STENCIL_BACK_WRITEMASK: 0x8ca5,
    STENCIL_BITS: 0xd57,
    STENCIL_BUFFER_BIT: 0x400,
    STENCIL_BUFFER_BIT0_QCOM: 0x10000,
    STENCIL_BUFFER_BIT1_QCOM: 0x20000,
    STENCIL_BUFFER_BIT2_QCOM: 0x40000,
    STENCIL_BUFFER_BIT3_QCOM: 0x80000,
    STENCIL_BUFFER_BIT4_QCOM: 0x100000,
    STENCIL_BUFFER_BIT5_QCOM: 0x200000,
    STENCIL_BUFFER_BIT6_QCOM: 0x400000,
    STENCIL_BUFFER_BIT7_QCOM: 0x800000,
    STENCIL_CLEAR_VALUE: 0xb91,
    STENCIL_EXT: 0x1802,
    STENCIL_FAIL: 0xb94,
    STENCIL_FUNC: 0xb92,
    STENCIL_INDEX1_OES: 0x8d46,
    STENCIL_INDEX4_OES: 0x8d47,
    STENCIL_INDEX: 0x1901,
    STENCIL_INDEX8: 0x8d48,
    STENCIL_PASS_DEPTH_FAIL: 0xb95,
    STENCIL_PASS_DEPTH_PASS: 0xb96,
    STENCIL_REF: 0xb97,
    STENCIL_TEST: 0xb90,
    STENCIL_VALUE_MASK: 0xb93,
    STENCIL_WRITEMASK: 0xb98,
    STREAM_DRAW: 0x88e0,
    SUBPIXEL_BITS: 0xd50,
    SYNC_CONDITION_APPLE: 0x9113,
    SYNC_FENCE_APPLE: 0x9116,
    SYNC_FLAGS_APPLE: 0x9115,
    SYNC_FLUSH_COMMANDS_BIT_APPLE: 0x1,
    SYNC_GPU_COMMANDS_COMPLETE_APPLE: 0x9117,
    SYNC_OBJECT_APPLE: 0x8a53,
    SYNC_STATUS_APPLE: 0x9114,
    TEXTURE: 0x1702,
    TEXTURE0: 0x84c0,
    TEXTURE1: 0x84c1,
    TEXTURE10: 0x84ca,
    TEXTURE11: 0x84cb,
    TEXTURE12: 0x84cc,
    TEXTURE13: 0x84cd,
    TEXTURE14: 0x84ce,
    TEXTURE15: 0x84cf,
    TEXTURE16: 0x84d0,
    TEXTURE17: 0x84d1,
    TEXTURE18: 0x84d2,
    TEXTURE19: 0x84d3,
    TEXTURE2: 0x84c2,
    TEXTURE20: 0x84d4,
    TEXTURE21: 0x84d5,
    TEXTURE22: 0x84d6,
    TEXTURE23: 0x84d7,
    TEXTURE24: 0x84d8,
    TEXTURE25: 0x84d9,
    TEXTURE26: 0x84da,
    TEXTURE27: 0x84db,
    TEXTURE28: 0x84dc,
    TEXTURE29: 0x84dd,
    TEXTURE3: 0x84c3,
    TEXTURE30: 0x84de,
    TEXTURE31: 0x84df,
    TEXTURE4: 0x84c4,
    TEXTURE5: 0x84c5,
    TEXTURE6: 0x84c6,
    TEXTURE7: 0x84c7,
    TEXTURE8: 0x84c8,
    TEXTURE9: 0x84c9,
    TEXTURE_2D: 0xde1,
    TEXTURE_3D_OES: 0x806f,
    TEXTURE_BINDING_2D: 0x8069,
    TEXTURE_BINDING_3D_OES: 0x806a,
    TEXTURE_BINDING_CUBE_MAP: 0x8514,
    TEXTURE_BINDING_EXTERNAL_OES: 0x8d67,
    TEXTURE_BORDER_COLOR_NV: 0x1004,
    TEXTURE_COMPARE_FUNC_EXT: 0x884d,
    TEXTURE_COMPARE_MODE_EXT: 0x884c,
    TEXTURE_CUBE_MAP: 0x8513,
    TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851a,
    TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
    TEXTURE_DEPTH_QCOM: 0x8bd4,
    TEXTURE_EXTERNAL_OES: 0x8d65,
    TEXTURE_FORMAT_QCOM: 0x8bd6,
    TEXTURE_HEIGHT_QCOM: 0x8bd3,
    TEXTURE_IMAGE_VALID_QCOM: 0x8bd8,
    TEXTURE_IMMUTABLE_FORMAT_EXT: 0x912f,
    TEXTURE_INTERNAL_FORMAT_QCOM: 0x8bd5,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_MAX_ANISOTROPY_EXT: 0x84fe,
    TEXTURE_MAX_LEVEL_APPLE: 0x813d,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_NUM_LEVELS_QCOM: 0x8bd9,
    TEXTURE_OBJECT_VALID_QCOM: 0x8bdb,
    TEXTURE_SAMPLES_IMG: 0x9136,
    TEXTURE_TARGET_QCOM: 0x8bda,
    TEXTURE_TYPE_QCOM: 0x8bd7,
    TEXTURE_USAGE_ANGLE: 0x93a2,
    TEXTURE_WIDTH_QCOM: 0x8bd2,
    TEXTURE_WRAP_R_OES: 0x8072,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    TIMEOUT_EXPIRED_APPLE: 0x911b,
    TIMEOUT_IGNORED_APPLE: 0xffffffffffffffff,
    TRANSLATED_SHADER_SOURCE_LENGTH_ANGLE: 0x93a0,
    TRIANGLES: 0x4,
    TRIANGLE_FAN: 0x6,
    TRIANGLE_STRIP: 0x5,
    TRUE: 0x1,
    UNKNOWN_CONTEXT_RESET_EXT: 0x8255,
    UNPACK_ALIGNMENT: 0xcf5,
    UNPACK_ROW_LENGTH: 0xcf2,
    UNPACK_SKIP_PIXELS: 0xcf4,
    UNPACK_SKIP_ROWS: 0xcf3,
    UNSIGNALED_APPLE: 0x9118,
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_INT: 0x1405,
    UNSIGNED_INT64_AMD: 0x8bc2,
    UNSIGNED_INT_10_10_10_2_OES: 0x8df6,
    UNSIGNED_INT_24_8_OES: 0x84fa,
    UNSIGNED_INT_2_10_10_10_REV_EXT: 0x8368,
    UNSIGNED_NORMALIZED_EXT: 0x8c17,
    UNSIGNED_SHORT: 0x1403,
    UNSIGNED_SHORT_1_5_5_5_REV_EXT: 0x8366,
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    UNSIGNED_SHORT_4_4_4_4_REV_EXT: 0x8365,
    UNSIGNED_SHORT_4_4_4_4_REV_IMG: 0x8365,
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    UNSIGNED_SHORT_5_6_5: 0x8363,
    UNSIGNED_SHORT_8_8_APPLE: 0x85ba,
    UNSIGNED_SHORT_8_8_REV_APPLE: 0x85bb,
    VALIDATE_STATUS: 0x8b83,
    VENDOR: 0x1f00,
    VERSION: 0x1f02,
    VERTEX_ARRAY_BINDING_OES: 0x85b5,
    VERTEX_ARRAY_OBJECT_EXT: 0x9154,
    VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889f,
    VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 0x88fe,
    VERTEX_ATTRIB_ARRAY_DIVISOR_NV: 0x88fe,
    VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622,
    VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886a,
    VERTEX_ATTRIB_ARRAY_POINTER: 0x8645,
    VERTEX_ATTRIB_ARRAY_SIZE: 0x8623,
    VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624,
    VERTEX_ATTRIB_ARRAY_TYPE: 0x8625,
    VERTEX_SHADER: 0x8b31,
    VERTEX_SHADER_BIT_EXT: 0x1,
    VIEWPORT: 0xba2,
    VIV_shader_binary: 0x1,
    WAIT_FAILED_APPLE: 0x911d,
    WRITEONLY_RENDERING_QCOM: 0x8823,
    WRITE_ONLY_OES: 0x88b9,
    Z400_BINARY_AMD: 0x8740,
    ZERO: 0x0,

    RASTERIZER_DISCARD: 0x8C89,
    UNPACK_FLIP_Y_WEBGL: 0x9240,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
    CONTEXT_LOST_WEBGL: 0x9242,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243,
    BROWSER_DEFAULT_WEBGL: 0x9244
};

for (var k in GL_CONSTANTS) {
    WebGLRenderingContext[k] = GL_CONSTANTS[k];
}

/***/ }),

/***/ "./src/WebSocket.js":
/*!**************************!*\
  !*** ./src/WebSocket.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(/*! ./utils/util */ "./src/utils/util.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _taskMap = new WeakMap();

var WebSocket = function () {
    function WebSocket(url) {
        var _this = this;

        var protocols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, WebSocket);

        this.OPEN = WebSocket.OPEN;
        this.CONNECTING = WebSocket.CONNECTING;
        this.CLOSING = WebSocket.CLOSING;
        this.CLOSED = WebSocket.CLOSED;

        this.binaryType = '';
        this.bufferedAmount = 0;
        this.extensions = '';

        this.onclose = null;
        this.onerror = null;
        this.onmessage = null;
        this.onopen = null;

        this.protocol = '';
        this.readyState = this.CLOSED;

        if (typeof url !== 'string' || !/(^ws:\/\/)|(^wss:\/\/)/.test(url)) {
            throw new TypeError('Failed to construct \'WebSocket\': The URL=\'' + url + '\' is invalid');
        }

        this.url = url;
        this.readyState = this.CONNECTING;

        var task = my.connectSocket({
            url: url,
            multiple: true,
            protocols: Array.isArray(protocols) ? protocols : [protocols],
            fail: function fail(res) {
                if (typeof _this.onerror === 'function') {
                    _this.onerror(new Error(res.errorMessage));
                }
            }
        });
        _taskMap.set(this, task);

        task.onOpen(function (res) {
            _this.readyState = _this.OPEN;
            if (typeof _this.onopen === 'function') {
                _this.onopen(res);
            }
        });

        task.onError(function (res) {
            if (typeof _this.onerror === 'function') {
                _this.onerror(new Error(res.errorMessage));
            }
        });

        task.onMessage(function (res) {
            if (typeof _this.onmessage === 'function') {
                if (res.data) {
                    var data = res.data;
                    if (data.isBuffer) {
                        // 对齐web转成arrayBuffer;
                        data.data = (0, _util.base64ToArrayBuffer)(data.data);
                    }
                    _this.onmessage(data);
                } else {
                    _this.onmessage(null);
                }
            }
        });

        task.onClose(function (res) {
            _this.readyState = _this.CLOSED;
            if (typeof _this.onclose === 'function') {
                _this.onclose(res);
            }
        });
    }

    _createClass(WebSocket, [{
        key: 'send',
        value: function send(data) {
            var _this2 = this;

            if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
                throw new TypeError('Failed to send message: The data ' + data + ' is invalid');
            }
            var p = {};
            if (data instanceof ArrayBuffer) {
                data = (0, _util.transformArrayBufferToBase64)(data);
                p.isBuffer = true;
            }
            p.data = data;
            p.fail = function (res) {
                if (typeof _this2.onerror === 'function') {
                    _this2.onerror(new Error(res.errorMessage));
                }
            };
            var task = _taskMap.get(this);
            task.send(p);
        }
    }, {
        key: 'close',
        value: function close() {
            this.readyState = this.CLOSING;
            var task = _taskMap.get(this);
            task.close();
        }
    }]);

    return WebSocket;
}();

WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;
exports.default = WebSocket;

/***/ }),

/***/ "./src/WindowProperties.js":
/*!*********************************!*\
  !*** ./src/WindowProperties.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _my$getSystemInfoSync = my.getSystemInfoSync(),
    screenWidth = _my$getSystemInfoSync.screenWidth,
    screenHeight = _my$getSystemInfoSync.screenHeight,
    pixelRatio = _my$getSystemInfoSync.pixelRatio,
    windowHeight = _my$getSystemInfoSync.windowHeight,
    windowWidth = _my$getSystemInfoSync.windowWidth;

var innerHeight = exports.innerHeight = windowHeight;
var innerWidth = exports.innerWidth = windowWidth;
var devicePixelRatio = exports.devicePixelRatio = pixelRatio;
var screen = exports.screen = {
  width: screenWidth,
  height: screenHeight,
  availWidth: innerWidth,
  availHeight: innerHeight,
  availLeft: 0,
  availTop: 0
};

/***/ }),

/***/ "./src/XMLHttpRequest.js":
/*!*******************************!*\
  !*** ./src/XMLHttpRequest.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventTarget2 = __webpack_require__(/*! ./EventTarget */ "./src/EventTarget.js");

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

var _Base = __webpack_require__(/*! ./Base64 */ "./src/Base64.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _url = new WeakMap();
var _method = new WeakMap();
var _requestHeader = new WeakMap();
var _responseHeader = new WeakMap();
var _requestTask = new WeakMap();

function _triggerEvent(type) {
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  event.target = event.target || this;
  if (typeof this['on' + type] === 'function') {
    this['on' + type].apply(this, event);
  }
}

function _changeReadyState(readyState) {
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  this.readyState = readyState;
  event.readyState = readyState;
  _triggerEvent.call(this, 'readystatechange', event);
}

function isRelativePath(url) {
  return !/^(http|https|ftp|file):\/\/.*/i.test(url);
}

var UNSEND = 0;
var OPENED = 1;
var HEADERS_RECEIVED = 2;
var LOADING = 3;
var DONE = 4;

var contentTypes = {
  json: "application/json",
  text: "application/text",
  arraybuffer: "application/octet-stream"
};

var XMLHttpRequest = function (_EventTarget) {
  _inherits(XMLHttpRequest, _EventTarget);

  function XMLHttpRequest() {
    _classCallCheck(this, XMLHttpRequest);

    var _this = _possibleConstructorReturn(this, (XMLHttpRequest.__proto__ || Object.getPrototypeOf(XMLHttpRequest)).call(this));

    _this.onabort = null;
    _this.onerror = null;
    _this.onload = null;
    _this.onloadstart = null;
    _this.onprogress = null;
    _this.ontimeout = null;
    _this.onloadend = null;

    _this.onreadystatechange = null;
    _this.readyState = 0;
    _this.response = null;
    _this.responseText = null;
    _this.responseType = '';
    _this.dataType = 'string';
    _this.responseXML = null;
    _this.status = 0;
    _this.statusText = '';
    _this.upload = {};
    _this.withCredentials = false;
    _this.timeout = 0;

    _requestHeader.set(_this, {
      'content-type': 'application/x-www-form-urlencoded'
    });
    _responseHeader.set(_this, {});
    return _this;
  }

  _createClass(XMLHttpRequest, [{
    key: "abort",
    value: function abort() {
      var myRequestTask = _requestTask.get(this);

      if (myRequestTask) {
        myRequestTask.abort();
      }
    }
  }, {
    key: "getAllResponseHeaders",
    value: function getAllResponseHeaders() {
      var responseHeader = _responseHeader.get(this);

      return Object.keys(responseHeader).map(function (header) {
        return header + ': ' + responseHeader[header];
      }).join('\n');
    }
  }, {
    key: "getResponseHeader",
    value: function getResponseHeader(header) {
      return _responseHeader.get("responseHeader")[header];
    }

    /* async, user, password 这几个参数在小程序内不支持*/

  }, {
    key: "open",
    value: function open(method, url) {
      _method.set(this, method);
      _url.set(this, url);
      _changeReadyState.call(this, OPENED);
    }
  }, {
    key: "overrideMimeType",
    value: function overrideMimeType() {}
  }, {
    key: "send",
    value: function send() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";


      if (this.readyState !== OPENED) {
        throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
      } else {

        var url = _url.get(this);

        var header = _requestHeader.get(this);

        var responseType = this.responseType;

        if (contentTypes[responseType]) {
          header["content-type"] = contentTypes[responseType];
        }
        delete this.response;
        this.response = null;

        var onSuccess = function onSuccess(res) {
          var data = res.data,
              status = res.status,
              headers = res.headers;

          status = status === undefined ? 200 : status;

          // 适配 readFile 回调
          if (!status && res.success) {
            status = 200;
          }

          this.status = status;
          if (headers) {
            _responseHeader.set(this, headers);
          }
          _triggerEvent.call(this, 'loadstart');
          _changeReadyState.call(this, HEADERS_RECEIVED);
          _changeReadyState.call(this, LOADING);

          if (this.responseType === "json" && typeof data === "string") {
            this.response = JSON.parse(data);
          } else {
            this.response = data;
          }

          if (data instanceof ArrayBuffer) {
            this.responseText = '';
            var bytes = new Uint8Array(data);
            var len = bytes.byteLength;

            for (var i = 0; i < len; i++) {
              this.responseText += String.fromCharCode(bytes[i]);
            }
          } else {
            this.responseText = data;
          }
          _changeReadyState.call(this, DONE);
          _triggerEvent.call(this, 'load');
          _triggerEvent.call(this, 'loadend');
        };

        var onFail = function onFail(res) {
          var _res$errorMessage = res.errorMessage,
              errorMessage = _res$errorMessage === undefined ? "" : _res$errorMessage;

          var data = res.data || "";
          if (data.includes("超时") || errorMessage.includes("超时")) {
            _triggerEvent.call(this, 'timeout');
          }

          _triggerEvent.call(this, 'error');
          _triggerEvent.call(this, 'loadend');
        };

        var relativePath = isRelativePath(url);
        var encoding;
        if (this.responseType !== 'arraybuffer') {
          encoding = 'utf8';
        }

        if (relativePath) {
          var fs = my.getFileSystemManager();
          var fpath = url;
          if (url.length >= 1 && url[0] === '/') {
            fpath = url.substr(1);
          }
          if (url.length >= 2 && url[0] === '.' && url[1] === '/') {
            fpath = url.substr(2);
          }

          var options = {
            filePath: fpath,
            success: onSuccess.bind(this),
            fail: onFail.bind(this)
          };
          if (encoding) {
            options.encoding = encoding;
          }
          fs.readFile(options);
          return;
        }

        var task = my.request({
          data: data,
          url: url,
          method: _method.get(this),
          headers: _requestHeader.get(this),
          timeout: this.timeout ? this.timeout : 30000,
          dataType: responseType,
          responseType: responseType,
          success: onSuccess.bind(this),
          fail: onFail.bind(this)
        });

        _requestTask.set(this, task);
      }
    }
  }, {
    key: "setRequestHeader",
    value: function setRequestHeader(header, value) {
      var myHeader = _requestHeader.get(this);
      myHeader[header] = value;
      _requestHeader.set(this, myHeader);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      var _this2 = this;

      if (typeof listener === 'function') {
        this['on' + type] = function () {
          var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          event.target = event.target || _this2;
          listener.call(_this2, event);
        };
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      if (this['on' + type] === listener) {
        this['on' + type] = null;
      }
    }
  }]);

  return XMLHttpRequest;
}(_EventTarget3.default);

exports.default = XMLHttpRequest;

/***/ }),

/***/ "./src/document.js":
/*!*************************!*\
  !*** ./src/document.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Event = __webpack_require__(/*! ./Event */ "./src/Event.js");

var _Event2 = _interopRequireDefault(_Event);

var _HTMLElement = __webpack_require__(/*! ./HTMLElement */ "./src/HTMLElement.js");

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

var _HTMLVideoElement = __webpack_require__(/*! ./HTMLVideoElement */ "./src/HTMLVideoElement.js");

var _HTMLVideoElement2 = _interopRequireDefault(_HTMLVideoElement);

var _Image = __webpack_require__(/*! ./Image */ "./src/Image.js");

var _Image2 = _interopRequireDefault(_Image);

var _Audio = __webpack_require__(/*! ./Audio */ "./src/Audio.js");

var _Audio2 = _interopRequireDefault(_Audio);

var _Canvas = __webpack_require__(/*! ./Canvas */ "./src/Canvas.js");

var _Canvas2 = _interopRequireDefault(_Canvas);

__webpack_require__(/*! ./EventIniter/index.js */ "./src/EventIniter/index.js");

var _WindowProperties = __webpack_require__(/*! ./WindowProperties */ "./src/WindowProperties.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = {};

var getElementsByTagName_;
if (window.document && window.document.getElementsByTagName) {
    getElementsByTagName_ = window.document.getElementsByTagName.bind(window.document);
}

var document = {
    readyState: 'complete',
    visibilityState: 'visible', // 'visible' , 'hidden'
    fullscreen: true,
    hidden: false,
    style: {},
    scripts: [],

    location: window.location,

    ontouchstart: null,
    ontouchmove: null,
    ontouchend: null,
    onvisibilitychange: null,

    head: new _HTMLElement2.default("head"),
    body: new _HTMLElement2.default("body"),

    documentElement: {
        clientWidth: _WindowProperties.screen.width,
        clientHight: _WindowProperties.screen.height,
        clientLeft: 0,
        clientTop: 0,
        scrollLeft: 0,
        scrollTop: 0
    },

    createElement: function createElement(tagName) {
        tagName = tagName.toLowerCase();
        if (tagName === 'canvas') {
            return new _Canvas2.default();
        } else if (tagName === 'audio') {
            return new _Audio2.default();
        } else if (tagName === 'img') {
            return new _Image2.default();
        } else if (tagName === 'video') {
            return new _HTMLVideoElement2.default();
        }

        return new _HTMLElement2.default(tagName);
    },
    createElementNS: function createElementNS(nameSpace, tagName) {
        return this.createElement(tagName);
    },
    getElementById: function getElementById(id) {
        if (id === window.canvas.id) {
            return window.canvas;
        }
        return null;
    },
    getElementsByTagName: function getElementsByTagName(tagName) {
        if (getElementsByTagName_) {
            return getElementsByTagName_(tagName);
        }

        tagName = tagName.toLowerCase();
        if (tagName === 'head') {
            return [document.head];
        } else if (tagName === 'body') {
            return [document.body];
        } else if (tagName === 'canvas') {
            return [window.canvas];
        }
        return [];
    },
    getElementsByTagNameNS: function getElementsByTagNameNS(nameSpace, tagName) {
        return this.getElementsByTagName(tagName);
    },
    getElementsByName: function getElementsByName(tagName) {
        if (tagName === 'head') {
            return [document.head];
        } else if (tagName === 'body') {
            return [document.body];
        } else if (tagName === 'canvas') {
            return [window.canvas];
        }
        return [];
    },
    querySelector: function querySelector(query) {
        if (query === 'head') {
            return document.head;
        } else if (query === 'body') {
            return document.body;
        } else if (query === 'canvas') {
            return window.canvas;
        } else if (query === '#' + window.canvas.id) {
            return window.canvas;
        }
        return null;
    },
    querySelectorAll: function querySelectorAll(query) {
        if (query === 'head') {
            return [document.head];
        } else if (query === 'body') {
            return [document.body];
        } else if (query === 'canvas') {
            return [window.canvas];
        }
        return [];
    },
    addEventListener: function addEventListener(type, listener) {
        if (!events[type]) {
            events[type] = [];
        }
        events[type].push(listener);
    },
    removeEventListener: function removeEventListener(type, listener) {
        var listeners = events[type];

        if (listeners && listeners.length > 0) {
            for (var i = listeners.length; i--; i > 0) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },
    dispatchEvent: function dispatchEvent(event) {
        var type = event.type;
        var listeners = events[type];

        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](event);
            }
        }

        window.canvas.dispatchEvent(event);

        if (event.target && typeof event.target['on' + type] === 'function') {
            event.target['on' + type](event);
        }
    }
};

function onVisibilityChange(visible) {

    return function () {

        document.visibilityState = visible ? 'visible' : 'hidden';

        var hidden = !visible;
        if (document.hidden === hidden) {
            return;
        }
        document.hidden = hidden;

        var event = new _Event2.default('visibilitychange');

        event.target = document;
        event.timeStamp = Date.now();

        document.dispatchEvent(event);
    };
}

if (my.onHide) {
    my.onHide(onVisibilityChange(false));
}
if (my.onShow) {
    my.onShow(onVisibilityChange(true));
}

exports.default = document;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _window2 = __webpack_require__(/*! ./window */ "./src/window.js");

var _window = _interopRequireWildcard(_window2);

var _document = __webpack_require__(/*! ./document */ "./src/document.js");

var _document2 = _interopRequireDefault(_document);

var _util = __webpack_require__(/*! ./utils/util */ "./src/utils/util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function inject() {
    _window.document = _document2.default;

    _window.addEventListener = function (type, listener) {
        _window.document.addEventListener(type, listener);
    };
    _window.removeEventListener = function (type, listener) {
        _window.document.removeEventListener(type, listener);
    };
    _window.dispatchEvent = function () {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        console.log('window.dispatchEvent', event.type, event);
    };

    if (_util.isIDE) {
        for (var key in _window) {
            // 兼容IDE不支持Blob（request无回调）
            if (key === 'Blob' || key === 'URL') {
                continue;
            }
            var descriptor = Object.getOwnPropertyDescriptor(window, key);

            if (!descriptor || descriptor.configurable === true) {
                Object.defineProperty(window, key, {
                    value: _window[key]
                });
            }
        }

        for (var _key in _window.document) {
            var _descriptor = Object.getOwnPropertyDescriptor(window.document, _key);

            if (!_descriptor || _descriptor.configurable === true) {
                Object.defineProperty(window.document, _key, {
                    value: _window.document[_key]
                });
            }
        }
        window.parent = window;
        window.my = my;
    } else {
        _window.my = my;
        for (var _key2 in _window) {
            window[_key2] = _window[_key2];
        }
    }
}

inject();

/***/ }),

/***/ "./src/localStorage.js":
/*!*****************************!*\
  !*** ./src/localStorage.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var localStorage = {
    get length() {
        var _my$getStorageInfoSyn = my.getStorageInfoSync(),
            keys = _my$getStorageInfoSyn.keys;

        console.log("getStorageInfoSync: " + JSON.stringify(my.getStorageInfoSync()));
        return keys.length;
    },

    key: function key(n) {
        var _my$getStorageInfoSyn2 = my.getStorageInfoSync(),
            keys = _my$getStorageInfoSyn2.keys;

        return keys[n];
    },
    getItem: function getItem(key) {
        var value = my.getStorageSync({ key: key });
        return value.data === null ? null : value.data;
    },
    setItem: function setItem(key, value) {
        if (window.asyncStorage) {
            return my.setStorage({
                key: key,
                data: value
            });
        }
        return my.setStorageSync({ key: key, data: value });
    },
    removeItem: function removeItem(key) {
        if (window.asyncStorage) {
            return my.removeStorage({
                key: key
            });
        }
        return my.removeStorageSync({ key: key });
    },
    clear: function clear() {
        if (window.asyncStorage) {
            return my.clearStorage();
        }
        return my.clearStorageSync();
    }
};

exports.default = localStorage;

/***/ }),

/***/ "./src/location.js":
/*!*************************!*\
  !*** ./src/location.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var location = {
  href: 'game.js',
  hostname: "alipay.com",

  reload: function reload() {},
  replace: function replace() {}
};

exports.default = location;

/***/ }),

/***/ "./src/navigator.js":
/*!**************************!*\
  !*** ./src/navigator.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _noop = __webpack_require__(/*! ./utils/noop */ "./src/utils/noop.js");

var systemInfo = my.getSystemInfoSync();

var _ref = systemInfo || {},
    system = _ref.system,
    _ref$platform = _ref.platform,
    platform = _ref$platform === undefined ? "android" : _ref$platform,
    language = _ref.language;

var android = platform.toLowerCase().indexOf('android') !== -1;

if (my.onNetworkStatusChange) {
    my.onNetworkStatusChange(function (res) {
        navigator.onLine = res.isConnected ? true : false;
    });
}

function getCurrentPosition(cb) {
    if (typeof cb !== "function") {
        throw new TypeError("Failed to execute 'getCurrentPosition' on 'Geolocation': 1 argument required, but only 0 present.");
    }

    my.getLocation({
        success: function success(res) {
            var accuracy = res.accuracy,
                latitude = res.latitude,
                longitude = res.longitude;

            cb({
                coords: {
                    accuracy: accuracy,
                    latitude: latitude,
                    longitude: longitude
                },
                timestamp: new Date().valueOf()
            });
        }
    });
}

var uaDesc = android ? 'Android; CPU ' + system : 'iPhone; CPU iPhone OS ' + system + ' like Mac OS X';
var userAgent = "Mozilla/5.0 (" + uaDesc + ") AliApp(AP/" + systemInfo.version + ") AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 AlipayMiniGame NetType/WIFI Language/" + language;
if (window.navigator) {
    userAgent = window.navigator.userAgent + " AlipayMiniGame";
}

var navigator = {
    platform: platform,
    language: language,
    userAgent: userAgent,
    appVersion: '5.0 (' + uaDesc + ') AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    geolocation: {
        getCurrentPosition: getCurrentPosition,
        watchPositon: _noop.noop,
        clearWatch: _noop.noop
    }
};

exports.default = navigator;

/***/ }),

/***/ "./src/utils/noop.js":
/*!***************************!*\
  !*** ./src/utils/noop.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = noop;
function noop() {};

/***/ }),

/***/ "./src/utils/util.js":
/*!***************************!*\
  !*** ./src/utils/util.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIDE = undefined;
exports.transformArrayBufferToBase64 = transformArrayBufferToBase64;
exports.arrayBufferToBase64 = arrayBufferToBase64;
exports.base64ToArrayBuffer = base64ToArrayBuffer;

var _Base = __webpack_require__(/*! ../Base64 */ "./src/Base64.js");

function transformArrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  for (var len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return (0, _Base.btoa)(binary);
}

function encode(str) {
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var string = String(str);
  var result = '';
  var currentIndex = 0;
  var sum = void 0;
  while (string.charAt(0 | currentIndex) || (encodings = '=', currentIndex % 1)) {
    currentIndex += 0.75; // 每次移动3/4个位置
    var currentCode = string.charCodeAt(currentIndex); // 获取code point
    if (currentCode > 255) {
      // 大于255无法处理
      throw new Error('"btoa" failed');
    }
    sum = sum << 8 | currentCode; // 每次在上次的基础上左移8位再加上当前code point
    var encodeIndex = 63 & sum >> 8 - currentIndex % 1 * 8; // 去除多余的位数，再去最后6位
    result += encodings.charAt(encodeIndex);
  }

  return result;
}

function decode(str) {
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var res = '';
  var string = String(str).replace(/[=]+$/, '');
  var o,
      r,
      i = 0,
      currentIndex = 0;
  while (r = string.charAt(currentIndex)) {
    currentIndex = currentIndex + 1;
    r = encodings.indexOf(r);
    if (~r) {
      o = i % 4 ? 64 * o + r : r;
      if (i++ % 4) {
        res += String.fromCharCode(255 & o >> (-2 * i & 6));
      }
    }
  }

  return res;
}

function arrayBufferToBase64(buffer) {
  var result = '';
  var uintArray = new Uint8Array(buffer);
  var byteLength = uintArray.byteLength;
  for (var i = 0; i < byteLength; i++) {
    result += String.fromCharCode(uintArray[i]);
  }
  return encode(result);
}

function base64ToArrayBuffer(base64) {
  var string = decode(base64);
  var length = string.length;
  var uintArray = new Uint8Array(length);
  for (var i = 0; i < length; i++) {
    uintArray[i] = string.charCodeAt(i);
  }
  return uintArray.buffer;
}

var isIDE = exports.isIDE = window.navigator && /AlipayIDE/.test(window.navigator.userAgent);

/***/ }),

/***/ "./src/window.js":
/*!***********************!*\
  !*** ./src/window.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.canvas = exports.location = exports.atob = exports.btoa = exports.localStorage = exports.MouseEvent = exports.TouchEvent = exports.WebGLRenderingContext = exports.HTMLVideoElement = exports.HTMLAudioElement = exports.HTMLMediaElement = exports.HTMLCanvasElement = exports.HTMLImageElement = exports.HTMLElement = exports.Element = exports.FileReader = exports.Audio = exports.URL = exports.Blob = exports.ImageBitmap = exports.Image = exports.WebSocket = exports.XMLHttpRequest = exports.navigator = undefined;

var _navigator = __webpack_require__(/*! ./navigator */ "./src/navigator.js");

Object.defineProperty(exports, 'navigator', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_navigator).default;
    }
});

var _XMLHttpRequest = __webpack_require__(/*! ./XMLHttpRequest */ "./src/XMLHttpRequest.js");

Object.defineProperty(exports, 'XMLHttpRequest', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_XMLHttpRequest).default;
    }
});

var _WebSocket = __webpack_require__(/*! ./WebSocket */ "./src/WebSocket.js");

Object.defineProperty(exports, 'WebSocket', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_WebSocket).default;
    }
});

var _Image = __webpack_require__(/*! ./Image */ "./src/Image.js");

Object.defineProperty(exports, 'Image', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_Image).default;
    }
});

var _ImageBitmap = __webpack_require__(/*! ./ImageBitmap */ "./src/ImageBitmap.js");

Object.defineProperty(exports, 'ImageBitmap', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_ImageBitmap).default;
    }
});

var _Blob = __webpack_require__(/*! ./Blob */ "./src/Blob.js");

Object.defineProperty(exports, 'Blob', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_Blob).default;
    }
});

var _Url = __webpack_require__(/*! ./Url */ "./src/Url.js");

Object.defineProperty(exports, 'URL', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_Url).default;
    }
});

var _Audio = __webpack_require__(/*! ./Audio */ "./src/Audio.js");

Object.defineProperty(exports, 'Audio', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_Audio).default;
    }
});

var _FileReader = __webpack_require__(/*! ./FileReader */ "./src/FileReader.js");

Object.defineProperty(exports, 'FileReader', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_FileReader).default;
    }
});

var _Element = __webpack_require__(/*! ./Element */ "./src/Element.js");

Object.defineProperty(exports, 'Element', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_Element).default;
    }
});

var _HTMLElement = __webpack_require__(/*! ./HTMLElement */ "./src/HTMLElement.js");

Object.defineProperty(exports, 'HTMLElement', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_HTMLElement).default;
    }
});

var _HTMLImageElement = __webpack_require__(/*! ./HTMLImageElement */ "./src/HTMLImageElement.js");

Object.defineProperty(exports, 'HTMLImageElement', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_HTMLImageElement).default;
    }
});

var _HTMLCanvasElement = __webpack_require__(/*! ./HTMLCanvasElement */ "./src/HTMLCanvasElement.js");

Object.defineProperty(exports, 'HTMLCanvasElement', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_HTMLCanvasElement).default;
    }
});

var _HTMLMediaElement = __webpack_require__(/*! ./HTMLMediaElement */ "./src/HTMLMediaElement.js");

Object.defineProperty(exports, 'HTMLMediaElement', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_HTMLMediaElement).default;
    }
});

var _HTMLAudioElement = __webpack_require__(/*! ./HTMLAudioElement */ "./src/HTMLAudioElement.js");

Object.defineProperty(exports, 'HTMLAudioElement', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_HTMLAudioElement).default;
    }
});

var _HTMLVideoElement = __webpack_require__(/*! ./HTMLVideoElement */ "./src/HTMLVideoElement.js");

Object.defineProperty(exports, 'HTMLVideoElement', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_HTMLVideoElement).default;
    }
});

var _WebGLRenderingContext = __webpack_require__(/*! ./WebGLRenderingContext */ "./src/WebGLRenderingContext.js");

Object.defineProperty(exports, 'WebGLRenderingContext', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_WebGLRenderingContext).default;
    }
});

var _index = __webpack_require__(/*! ./EventIniter/index.js */ "./src/EventIniter/index.js");

Object.defineProperty(exports, 'TouchEvent', {
    enumerable: true,
    get: function get() {
        return _index.TouchEvent;
    }
});
Object.defineProperty(exports, 'MouseEvent', {
    enumerable: true,
    get: function get() {
        return _index.MouseEvent;
    }
});

var _localStorage = __webpack_require__(/*! ./localStorage */ "./src/localStorage.js");

Object.defineProperty(exports, 'localStorage', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_localStorage).default;
    }
});

var _Base = __webpack_require__(/*! ./Base64 */ "./src/Base64.js");

Object.defineProperty(exports, 'btoa', {
    enumerable: true,
    get: function get() {
        return _Base.btoa;
    }
});
Object.defineProperty(exports, 'atob', {
    enumerable: true,
    get: function get() {
        return _Base.atob;
    }
});

var _WindowProperties = __webpack_require__(/*! ./WindowProperties */ "./src/WindowProperties.js");

Object.keys(_WindowProperties).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _WindowProperties[key];
        }
    });
});
exports.alert = alert;
exports.focus = focus;
exports.blur = blur;

var _Canvas = __webpack_require__(/*! ./Canvas */ "./src/Canvas.js");

var _Canvas2 = _interopRequireDefault(_Canvas);

var _location = __webpack_require__(/*! ./location */ "./src/location.js");

var _location2 = _interopRequireDefault(_location);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var location = exports.location = _location2.default;

// 暴露全局的 canvas
window.screencanvas = window.screencanvas || new _Canvas2.default();
window.self = window;
var canvas = exports.canvas = window.screencanvas;

function alert(msg) {
    my.alert({
        content: msg
    });
}

function focus() {}

function blur() {}

/***/ })

/******/ });
//# sourceMappingURL=my-adapter.js.map