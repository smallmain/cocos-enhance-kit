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
import TiledAssembler from '../2d/tiled';

export default class MultiTiledAssembler extends TiledAssembler {
    getVfmt() {
        return vfmtPosUvColorTexId;
    }

    getBuffer() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }

    updateRenderData(sprite) {
        super.updateRenderData(sprite);

        if (sprite._texIdDirty) {
            sprite._updateMultiTexId(sprite.getMaterial(0), sprite.spriteFrame._texture);
        }

        // 不进行 Dirty 判断，Mesh 可能会变化，但是纹理不会变
        this.updateTexId(sprite);
        sprite._texIdDirty = false;
    }

    updateRenderDataForSwitchMaterial(sprite) {
        let frame = sprite._spriteFrame;
        let node = sprite.node;

        let contentWidth = this.contentWidth = Math.abs(node.width);
        let contentHeight = this.contentHeight = Math.abs(node.height);
        let rect = frame._rect;
        let leftWidth = frame.insetLeft, rightWidth = frame.insetRight, centerWidth = rect.width - leftWidth - rightWidth,
            topHeight = frame.insetTop, bottomHeight = frame.insetBottom, centerHeight = rect.height - topHeight - bottomHeight;
        this.sizableWidth = contentWidth - leftWidth - rightWidth;
        this.sizableHeight = contentHeight - topHeight - bottomHeight;
        this.sizableWidth = this.sizableWidth > 0 ? this.sizableWidth : 0;
        this.sizableHeight = this.sizableHeight > 0 ? this.sizableHeight : 0;
        let hRepeat = this.hRepeat = centerWidth === 0 ? this.sizableWidth : this.sizableWidth / centerWidth;
        let vRepeat = this.vRepeat = centerHeight === 0 ? this.sizableHeight : this.sizableHeight / centerHeight;
        let row = this.row = Math.ceil(vRepeat + 2);
        let col = this.col = Math.ceil(hRepeat + 2);

        // update data property
        let count = row * col;
        this.verticesCount = count * 4;
        this.indicesCount = count * 6;

        let renderData = this._renderData;
        let flexBuffer = renderData._flexBuffer;
        if (flexBuffer.reserve(this.verticesCount, this.indicesCount)) {
            this._updateIndices();
            this.updateColor(sprite);
        }
        flexBuffer.used(this.verticesCount, this.indicesCount);

        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }

        if (sprite._texIdDirty) {
            sprite._updateMultiTexId(sprite.getMaterial(0), sprite.spriteFrame._texture);
        }

        // 不进行 Dirty 判断，Mesh 可能会变化，但是纹理不会变
        this.updateTexId(sprite);
        sprite._texIdDirty = false;

        if (CC_JSB) this._aftUpdateRenderDataForNative();
    }
}

MultiTiledAssembler.prototype.floatsPerVert = 6;
MultiTiledAssembler.prototype.texIdOffset = 5;
MultiTiledAssembler.prototype.isMulti = true;
