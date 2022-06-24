/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import WebglBmfontAssembler from '../2d/bmfont';
import { vfmtPosUvColorTexId } from '../../../../webgl/vertex-format';

export default class MultiWebglBmfontAssembler extends WebglBmfontAssembler {
    initData () {
        let data = this._renderData;
        data.createFlexData(0, this.verticesCount, this.indicesCount, this.getVfmt());
    }

    getVfmt() {
        return vfmtPosUvColorTexId;
    }

    getBuffer() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }

    updateRenderData(comp) {
        super.updateRenderData(comp);

        if (comp._texIdDirty) {
            comp._updateMultiTexId(comp.getMaterial(0), comp._frame._texture);
        }

        // 不进行 Dirty 判断，文本可能会变化，但是纹理不会变
        this.updateTexId(comp);
        comp._texIdDirty = false;
    }

    updateRenderDataForSwitchMaterial(comp) {
        super._preUpdateRenderData(comp);
        super._aftUpdateRenderData(comp);

        if (comp._texIdDirty) {
            comp._updateMultiTexId(comp.getMaterial(0), comp._frame._texture);
        }

        // 不进行 Dirty 判断，文本可能会变化，但是纹理不会变
        this.updateTexId(comp);
        comp._texIdDirty = false;

        if (CC_JSB) this._aftUpdateRenderDataForNative();
    }
}

MultiWebglBmfontAssembler.prototype.floatsPerVert = 6;
MultiWebglBmfontAssembler.prototype.texIdOffset = 5;
MultiWebglBmfontAssembler.prototype.isMulti = true;
