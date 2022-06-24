/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const RenderFlow = cc.RenderFlow;

let originInit = cc.Assembler.prototype.init;

let FLAG_VERTICES_OPACITY_CHANGED = 1 << 0;
let FLAG_VERTICES_DIRTY = 1 << 1;

let Assembler = {
    _ctor () {
        this._dirtyPtr = new Uint32Array(1);
        this.setDirty(this._dirtyPtr);
        this.initVertexFormat();
    },

    destroy () {
        this._renderComp = null;
        this._effect = null;
    },

    clear () {
        this._renderData.clear();
    },

    _extendNative () {
        renderer.Assembler.prototype.ctor.call(this);
    },

    initVertexFormat () {
        let vfmt = this.getVfmt();
        if (!vfmt) return;
        this.setVertexFormat(vfmt._nativeObj);
    },

    init (renderComp) {
        this._effect = [];

        originInit.call(this, renderComp);

        if (renderComp.node && renderComp.node._proxy) {
            renderComp.node._proxy.setAssembler(this);
        }
    },

    _updateRenderData () {
        if (!this._renderComp || !this._renderComp.isValid) return;
        this.updateRenderData(this._renderComp);

        let materials = this._renderComp._materials;
        for (let i = 0; i < materials.length; i++) {
            let m = materials[i];
            // TODO: find why material can be null
            if (!m) continue;
            m.getHash();
            this.updateMaterial(i, m);
        }
    },

    updateRenderData (comp) {
        comp._assembler.updateMaterial(0, comp._materials[0]);
    },

    updateMaterial (iaIndex, material) {
        let effect = material && material.effect;
        if (this._effect[iaIndex] !== effect) {
            this._effect[iaIndex] = effect;
            this.updateEffect(iaIndex, effect ? effect._nativeObj : null);
        }
    },

    updateColor(comp, color) {
        this._dirtyPtr[0] |= FLAG_VERTICES_OPACITY_CHANGED;
    },

    updateIADatas (iaIndex, meshIndex) {
        // When the MeshBuffer is switched, it is necessary to synchronize the iaData of the native assembler.
        this.updateMeshIndex(iaIndex, meshIndex);
        let materials = this._renderComp._materials; 
        let material = materials[iaIndex] || materials[0];
        this.updateMaterial(iaIndex, material);
    }
};

cc.Assembler.FLAG_VERTICES_OPACITY_CHANGED = FLAG_VERTICES_OPACITY_CHANGED;
cc.Assembler.FLAG_VERTICES_DIRTY = FLAG_VERTICES_DIRTY;

Object.setPrototypeOf(cc.Assembler.prototype, renderer.Assembler.prototype);

cc.js.mixin(cc.Assembler.prototype, Assembler);

module.exports = Assembler;