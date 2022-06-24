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

import { vfmtPosUvColorTexId } from '../../../../webgl/vertex-format';
import RadialFilledAssembler from '../2d/radial-filled';

export default class MultiRadialFilledAssembler extends RadialFilledAssembler {
    initData (sprite) {
        this._renderData.createFlexData(0, 4, 6, this.getVfmt());
        this.updateIndices();
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
            sprite._updateMultiTexId(sprite.getMaterial(0), sprite.spriteFrame._texture);
        }

        // 不进行 Dirty 判断，Mesh 可能会变化，但是纹理不会变
        this.updateTexId(sprite);
        sprite._texIdDirty = false;
    }

    updateRenderDataForSwitchMaterial(sprite) {
        this._aftUpdateRenderData(sprite);

        if (sprite._texIdDirty) {
            sprite._updateMultiTexId(sprite.getMaterial(0), sprite.spriteFrame._texture);
        }

        // 不进行 Dirty 判断，Mesh 可能会变化，但是纹理不会变
        this.updateTexId(sprite);
        sprite._texIdDirty = false;

        if (CC_JSB) this._aftUpdateRenderDataForNative();
    }
}

MultiRadialFilledAssembler.prototype.floatsPerVert = 6;
MultiRadialFilledAssembler.prototype.texIdOffset = 5;
MultiRadialFilledAssembler.prototype.isMulti = true;
