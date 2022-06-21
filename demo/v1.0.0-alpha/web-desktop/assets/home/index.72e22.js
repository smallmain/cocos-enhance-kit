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
  home: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fae4avBZoFIhLI0tl2YbZCe", "home");
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
    var Home = function(_super) {
      __extends(Home, _super);
      function Home() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.objectNumLabel = null;
        _this.objectNumSlider = null;
        _this.enbaleMultiNode = null;
        _this.objects = null;
        _this.nums = [ 10, 1e4 ];
        _this.num = _this.nums[0];
        _this.enableMultiRender = true;
        _this.prefabs = [];
        return _this;
      }
      Home.prototype.onLoad = function() {
        var _this = this;
        this.prefabs = this.objects.children.concat();
        this.objects.removeAllChildren(false);
        this.objectNumSlider.node.on("slide", function(slider) {
          var offset = (_this.nums[1] - _this.nums[0]) * slider.progress;
          _this.num = _this.nums[0] + Math.ceil(offset);
          _this.numUpdate();
        });
        this.enbaleMultiNode.on("toggle", function(toggle) {
          _this.enableMultiRender = toggle.isChecked;
          _this.multiRenderUpdate();
        });
        this.objectNumSlider.progress = .02;
        var offset = (this.nums[1] - this.nums[0]) * this.objectNumSlider.progress;
        this.num = this.nums[0] + Math.ceil(offset);
        this.numUpdate();
        this.multiRenderUpdate();
      };
      Home.prototype.numUpdate = function() {
        this.objectNumLabel.string = "\u5bf9\u8c61\u6570\u91cf\uff1a" + this.num;
        var offset = this.num - this.objects.children.length;
        if (offset > 0) for (var i = 0; i < offset; i++) this.createObject(); else {
          offset = -offset;
          for (var i = 0; i < offset; i++) this.objects.children[i].destroy();
        }
      };
      Home.prototype.multiRenderUpdate = function() {
        this.reCreateObjects();
      };
      Home.prototype.reCreateObjects = function() {
        this.objects.destroyAllChildren();
        for (var i = 0; i < this.num; i++) this.createObject();
      };
      Home.prototype.createObject = function() {
        var _a, _b, _c;
        var random = Math.floor(Math.random() * this.prefabs.length);
        var node = cc.instantiate(this.prefabs[random]);
        if (this.enableMultiRender) {
          var comp = null !== (_c = null !== (_b = null !== (_a = node.getComponent(cc.Label)) && void 0 !== _a ? _a : node.getComponent(cc.Sprite)) && void 0 !== _b ? _b : node.getComponent(cc.RichText)) && void 0 !== _c ? _c : node.getComponent(sp.Skeleton);
          comp.autoSwitchMaterial = cc.RenderComponent.EnableType.ENABLE;
          comp.allowDynamicAtlas = cc.RenderComponent.EnableType.ENABLE;
        }
        this.objects.addChild(node);
        node.position = cc.v3(Math.floor(Math.random() * this.objects.width), Math.floor(Math.random() * this.objects.height));
        cc.tween(node).by(3, {
          angle: 360
        }).repeatForever().start();
      };
      __decorate([ property(cc.Label) ], Home.prototype, "objectNumLabel", void 0);
      __decorate([ property(cc.Slider) ], Home.prototype, "objectNumSlider", void 0);
      __decorate([ property(cc.Node) ], Home.prototype, "enbaleMultiNode", void 0);
      __decorate([ property(cc.Node) ], Home.prototype, "objects", void 0);
      Home = __decorate([ ccclass ], Home);
      return Home;
    }(cc.Component);
    exports.default = Home;
    cc._RF.pop();
  }, {} ]
}, {}, [ "home" ]);
//# sourceMappingURL=index.js.map
