// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

const gfx = window.gfx;

// Effect
let Effect = cc.Effect;
let _init = Effect.prototype.init;
let _clone = Effect.prototype.clone;
let _switchTechnique = Effect.prototype.switchTechnique;

Object.assign(Effect.prototype, {
    init (name, techniques, techniqueIndex, asset, createNative) {
        _init.call(this, name, techniques, techniqueIndex, asset);

        if (createNative) {
            this._nativeObj = new renderer.EffectNative();
            this._nativeObj.init(techniques);
            this._nativePtr = this._nativeObj.self();
        }
    },

    clone () {
        let effect = _clone.call(this);
        effect._nativeObj = new renderer.EffectNative();
        effect._nativeObj.copy(this._nativeObj);
        effect._nativePtr = effect._nativeObj.self();
        return effect;
    },

    switchTechnique: function switchTechnique(techniqueIndex) {
        _switchTechnique.call(this, techniqueIndex);
        this._nativeObj.switchTechnique(techniqueIndex);
    }
});

// EffectBase
let EffectBase = cc.EffectBase;
let _setCullMode = EffectBase.prototype.setCullMode;
let _setBlend = EffectBase.prototype.setBlend;
let _setStencilEnabled = EffectBase.prototype.setStencilEnabled;
let _setStencil = EffectBase.prototype.setStencil;
let _setDepth = EffectBase.prototype.setDepth;
let _define = EffectBase.prototype.define;
let _setProperty = EffectBase.prototype.setProperty;

Object.assign(EffectBase.prototype, {
    setCullMode (cullMode = gfx.CULL_BACK, passIdx) {
        _setCullMode.call(this, cullMode, passIdx);
        this._nativeObj.setCullMode(cullMode, passIdx === undefined ? -1 : passIdx);
    },

    setBlend (enabled = false,
        blendEq = gfx.BLEND_FUNC_ADD,
        blendSrc = gfx.BLEND_SRC_ALPHA,
        blendDst = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendAlphaEq = gfx.BLEND_FUNC_ADD,
        blendSrcAlpha = gfx.BLEND_SRC_ALPHA,
        blendDstAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        blendColor = 0xffffffff,
        passIdx) {
        _setBlend.call(this, enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx);
        this._nativeObj.setBlend(enabled, blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor, passIdx === undefined ? -1 : passIdx);
    },

    setDepth (depthTest, depthWrite, depthFunc, passIdx) {
        _setDepth.call(this, depthTest, depthWrite, depthFunc, passIdx);
        this._nativeObj.setDepth(depthTest, depthWrite, depthFunc, passIdx === undefined ? -1 : passIdx);
    },

    setStencilEnabled (enabled, passIdx) {
        _setStencilEnabled.call(this, enabled, passIdx);
        this._nativeObj.setStencilTest(enabled, passIdx === undefined ? -1 : passIdx);
    },

    setStencil (enabled = gfx.STENCIL_INHERIT,
        stencilFunc = gfx.DS_FUNC_ALWAYS,
        stencilRef = 0,
        stencilMask = 0xff,
        stencilFailOp = gfx.STENCIL_OP_KEEP,
        stencilZFailOp = gfx.STENCIL_OP_KEEP,
        stencilZPassOp = gfx.STENCIL_OP_KEEP,
        stencilWriteMask = 0xff,
        passIdx) {
        _setStencil.call(this, enabled, stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx);
        this._nativeObj.setStencil(stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask, passIdx === undefined ? -1 : passIdx);
    },

    define (name, value, passIdx, force) {
        _define.call(this, name, value, passIdx, force);
        this._nativeObj.define(name, value, passIdx === undefined ? -1 : passIdx);
    },

    updateHash (hash) {
        this._nativeObj.updateHash(hash);
    },

    setProperty (name, val, passIdx, directly) {
        _setProperty.call(this, name, val, passIdx);

        let prop = this.getProperty(name);
        if (prop !== undefined) {
            this._nativeObj.setProperty(name, prop, passIdx === undefined ? -1 : passIdx, directly);
        }
    }
})
