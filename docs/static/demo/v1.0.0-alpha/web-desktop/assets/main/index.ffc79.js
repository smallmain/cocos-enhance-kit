window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  "left-area": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "853f5uyG5pFHpEaXeXta1ML", "left-area");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __values = this && this.__values || function(o) {
      var s = "function" === typeof Symbol && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && "number" === typeof o.length) return {
        next: function() {
          o && i >= o.length && (o = void 0);
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var __read = this && this.__read || function(o, n) {
      var m = "function" === typeof Symbol && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((void 0 === n || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error) {
        e = {
          error: error
        };
      } finally {
        try {
          r && !r.done && (m = i["return"]) && m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return ar;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LeftArea = function(_super) {
      __extends(LeftArea, _super);
      function LeftArea() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.home = null;
        _this.multiMaterial = null;
        _this.multiBatcher = null;
        _this.charMode = null;
        _this.highDPI = null;
        _this.spineBatch = null;
        _this.spineSkin = null;
        _this.mainArea = null;
        _this.tick = 0;
        return _this;
      }
      LeftArea.prototype.start = function() {
        this.map = new Map([ [ this.home, {
          bundle: "home",
          path: "home"
        } ], [ this.multiMaterial, {
          bundle: "multi-render",
          path: "multi-material/multi-material"
        } ], [ this.multiBatcher, {
          bundle: "multi-render",
          path: "multi-batcher/multi-batcher"
        } ], [ this.charMode, {
          bundle: "text-render",
          path: "char-mode/char-mode"
        } ], [ this.highDPI, {
          bundle: "text-render",
          path: "high-dpi/high-dpi"
        } ], [ this.spineBatch, {
          bundle: "spine",
          path: "batch/spine-batch"
        } ], [ this.spineSkin, {
          bundle: "spine",
          path: "skin/spine-skin"
        } ] ]);
        this.initBtns();
        this.switchPage(this.map.get(this.home));
      };
      LeftArea.prototype.initBtns = function() {
        var e_1, _a;
        var _this = this;
        var _loop_1 = function(node, route) {
          node.on("toggle", function(toggle) {
            toggle.isChecked && _this.switchPage(route);
          });
        };
        try {
          for (var _b = __values(this.map), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), node = _d[0], route = _d[1];
            _loop_1(node, route);
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            _c && !_c.done && (_a = _b.return) && _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      };
      LeftArea.prototype.switchPage = function(route) {
        var _this = this;
        var cur = ++this.tick;
        this.mainArea.destroyAllChildren();
        route && cc.assetManager.loadBundle("common", function() {
          cc.assetManager.loadBundle(route.bundle, function(err, bundle) {
            err || bundle.load(route.path, cc.Prefab, function(err, prefab) {
              err || cur !== _this.tick || _this.mainArea.addChild(cc.instantiate(prefab));
            });
          });
        });
      };
      __decorate([ property(cc.Node) ], LeftArea.prototype, "home", void 0);
      __decorate([ property(cc.Node) ], LeftArea.prototype, "multiMaterial", void 0);
      __decorate([ property(cc.Node) ], LeftArea.prototype, "multiBatcher", void 0);
      __decorate([ property(cc.Node) ], LeftArea.prototype, "charMode", void 0);
      __decorate([ property(cc.Node) ], LeftArea.prototype, "highDPI", void 0);
      __decorate([ property(cc.Node) ], LeftArea.prototype, "spineBatch", void 0);
      __decorate([ property(cc.Node) ], LeftArea.prototype, "spineSkin", void 0);
      __decorate([ property(cc.Node) ], LeftArea.prototype, "mainArea", void 0);
      LeftArea = __decorate([ ccclass ], LeftArea);
      return LeftArea;
    }(cc.Component);
    exports.default = LeftArea;
    cc._RF.pop();
  }, {} ],
  main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2454fZB1jNNTbYkc7ryXmr1", "main");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Main = function(_super) {
      __extends(Main, _super);
      function Main() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.version = null;
        return _this;
      }
      Main.prototype.start = function() {
        this.version.string = "Version: v" + cc.sp.version + "\n";
      };
      __decorate([ property(cc.Label) ], Main.prototype, "version", void 0);
      Main = __decorate([ ccclass ], Main);
      return Main;
    }(cc.Component);
    exports.default = Main;
    cc.sp.labelRetinaScale = 2;
    cc.dynamicAtlasManager.maxFrameSize = 2048;
    cc._RF.pop();
  }, {} ]
}, {}, [ "left-area", "main" ]);
//# sourceMappingURL=index.js.map
