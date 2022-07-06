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
  "spine-skin": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "27990QihT9DxaLHUpAMue3v", "spine-skin");
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
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SpineSkin = function(_super) {
      __extends(SpineSkin, _super);
      function SpineSkin() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.addBoyBtn = null;
        _this.removeBoyBtn = null;
        _this.randomChangeBtn = null;
        _this.boy = null;
        _this.heads = [];
        _this.boys = [];
        _this.datas = [];
        return _this;
      }
      SpineSkin.prototype.start = function() {
        var _this = this;
        var boySpine = this.boy.getComponentInChildren(sp.Skeleton);
        var newSkeletonData = boySpine.skeletonData.clone();
        boySpine.skeletonData = newSkeletonData;
        boySpine.animation = "attack";
        this.datas.push(newSkeletonData);
        this.boys.push(this.boy);
        this.addBoyBtn.on("click", function() {
          var newBoy = cc.instantiate(_this.boy);
          var newBoySpine = newBoy.getComponentInChildren(sp.Skeleton);
          newBoySpine.skeletonData = boySpine.skeletonData.clone();
          newBoySpine.animation = "attack";
          _this.boy.parent.addChild(newBoy);
          newBoy.setPosition(_this.boys[_this.boys.length - 1].position);
          newBoy.x += 100;
          if (_this.boys.length % 2 === 1) {
            newBoy.getComponentInChildren(sp.Skeleton).setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.PRIVATE_CACHE);
            newBoy.getComponentInChildren(cc.Label).string = "Spine - Cache";
          }
          _this.datas.push(newBoySpine.skeletonData);
          _this.boys.push(newBoy);
        });
        this.removeBoyBtn.on("click", function() {
          if (_this.boys.length > 1) {
            _this.datas[_this.datas.length - 1].destroy();
            _this.boys[_this.boys.length - 1].destroy();
            _this.datas.length -= 1;
            _this.boys.length -= 1;
          }
        });
        this.randomChangeBtn.on("click", function() {
          var boy = _this.boys[_this.boys.length - 1].getComponentInChildren(sp.Skeleton);
          boy.setRegionData("Head", "Head", new sp.RegionData(_this.heads[Math.floor(Math.random() * _this.heads.length)]));
        });
      };
      SpineSkin.prototype.onDestroy = function() {
        var e_1, _a;
        try {
          for (var _b = __values(this.datas), _c = _b.next(); !_c.done; _c = _b.next()) {
            var data = _c.value;
            data.destroy();
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
      __decorate([ property(cc.Node) ], SpineSkin.prototype, "addBoyBtn", void 0);
      __decorate([ property(cc.Node) ], SpineSkin.prototype, "removeBoyBtn", void 0);
      __decorate([ property(cc.Node) ], SpineSkin.prototype, "randomChangeBtn", void 0);
      __decorate([ property(cc.Node) ], SpineSkin.prototype, "boy", void 0);
      __decorate([ property([ cc.SpriteFrame ]) ], SpineSkin.prototype, "heads", void 0);
      SpineSkin = __decorate([ ccclass ], SpineSkin);
      return SpineSkin;
    }(cc.Component);
    exports.default = SpineSkin;
    cc._RF.pop();
  }, {} ]
}, {}, [ "spine-skin" ]);
//# sourceMappingURL=index.js.map
