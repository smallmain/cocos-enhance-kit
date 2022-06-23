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
  "multi-batcher": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e9188DEK9FCYlYeL+jvmrQ", "multi-batcher");
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
    var MultiBatcher = function(_super) {
      __extends(MultiBatcher, _super);
      function MultiBatcher() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.batchBtn = null;
        _this.cancelBtn = null;
        _this.textures = null;
        return _this;
      }
      MultiBatcher.prototype.onLoad = function() {
        var _this = this;
        this.batchBtn.on("click", function() {
          var batcher = new cc.sp.MultiBatcher();
          batcher.init();
          _this.textures.children.forEach(function(v) {
            var sprite = v.getComponent(cc.Sprite);
            batcher.requsetMaterial(sprite.spriteFrame.getTexture());
            sprite.setVertsDirty();
          });
        });
        this.cancelBtn.on("click", function() {
          _this.textures.children.forEach(function(v) {
            var sprite = v.getComponent(cc.Sprite);
            sprite.spriteFrame.getTexture().unlinkMaterial();
            sprite.setMaterial(0, cc.Material.getBuiltinMaterial("2d-sprite"));
            sprite.setVertsDirty();
          });
        });
      };
      __decorate([ property(cc.Node) ], MultiBatcher.prototype, "batchBtn", void 0);
      __decorate([ property(cc.Node) ], MultiBatcher.prototype, "cancelBtn", void 0);
      __decorate([ property(cc.Node) ], MultiBatcher.prototype, "textures", void 0);
      MultiBatcher = __decorate([ ccclass ], MultiBatcher);
      return MultiBatcher;
    }(cc.Component);
    exports.default = MultiBatcher;
    cc._RF.pop();
  }, {} ]
}, {}, [ "multi-batcher" ]);
//# sourceMappingURL=index.js.map
