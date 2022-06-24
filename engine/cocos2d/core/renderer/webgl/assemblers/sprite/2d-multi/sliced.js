/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

import { vfmtPosUvColorTexId } from '../../../../webgl/vertex-format';
import SlicedAssembler from '../2d/sliced';

export default class MultiSlicedAssembler extends SlicedAssembler {
    initData (sprite) {
        if (this._renderData.meshCount > 0) return;
        this._renderData.createFlexData(0, this.verticesCount, this.indicesCount, this.getVfmt());

        let indices = this._renderData.iDatas[0];
        let indexOffset = 0;
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let start = r * 4 + c;
                indices[indexOffset++] = start;
                indices[indexOffset++] = start + 1;
                indices[indexOffset++] = start + 4;
                indices[indexOffset++] = start + 1;
                indices[indexOffset++] = start + 5;
                indices[indexOffset++] = start + 4;
            }
        }
    }

    getVfmt() {
        return vfmtPosUvColorTexId;
    }

    getBuffer() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }

    updateRenderData (sprite) {
        super.updateRenderData(sprite);

        if (sprite._texIdDirty) {
            sprite._updateMultiTexId(sprite.getMaterial(0), sprite._spriteFrame._texture);
            if (sprite._texIdDirty) {
                this.updateTexId(sprite);
                sprite._texIdDirty = false;
            }
        }
    }

    updateRenderDataForSwitchMaterial(sprite) {
        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }

        if (sprite._texIdDirty) {
            sprite._updateMultiTexId(sprite.getMaterial(0), sprite._spriteFrame._texture);
            if (sprite._texIdDirty) {
                this.updateTexId(sprite);
                sprite._texIdDirty = false;
            }
        }

        if (CC_JSB) this._aftUpdateRenderDataForNative();
    }

}

MultiSlicedAssembler.prototype.floatsPerVert = 6;
MultiSlicedAssembler.prototype.texIdOffset = 5;
MultiSlicedAssembler.prototype.isMulti = true;
