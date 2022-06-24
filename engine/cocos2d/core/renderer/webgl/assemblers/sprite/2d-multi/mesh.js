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
import MeshSpriteAssembler from '../2d/mesh';

export default class MultiMeshSpriteAssembler extends MeshSpriteAssembler {
    getVfmt() {
        return vfmtPosUvColorTexId;
    }

    getBuffer() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }

    updateRenderData(sprite) {
        let frame = sprite.spriteFrame;

        super.updateRenderData(sprite);

        if (frame) {
            if (sprite._texIdDirty) {
                sprite._updateMultiTexId(sprite.getMaterial(0), frame._texture);
            }

            // 不进行 Dirty 判断，Mesh 可能会变化，但是纹理不会变
            this.updateTexId(sprite);
            sprite._texIdDirty = false;
        }
    }

    updateRenderDataForSwitchMaterial(sprite) {
        let frame = sprite.spriteFrame;

        if (frame) {
            let vertices = frame.vertices;
            if (vertices) {
                this.verticesCount = vertices.x.length;
                this.indicesCount = vertices.triangles.length;

                let renderData = this._renderData;
                let flexBuffer = renderData._flexBuffer;
                if (flexBuffer.reserve(this.verticesCount, this.indicesCount)) {
                    this.updateColor(sprite);
                    sprite._vertsDirty = true;
                }
                flexBuffer.used(this.verticesCount, this.indicesCount);

                this.updateIndices(vertices.triangles);

                if (sprite._vertsDirty) {
                    this.updateUVs(sprite);
                    this.updateVerts(sprite);
                    this.updateWorldVerts(sprite);
                    sprite._vertsDirty = false;
                }
            }
        }

        if (sprite._texIdDirty) {
            sprite._updateMultiTexId(sprite.getMaterial(0), frame._texture);
        }

        // 不进行 Dirty 判断，Mesh 可能会变化，但是纹理不会变
        this.updateTexId(sprite);
        sprite._texIdDirty = false;

        if (CC_JSB) this._aftUpdateRenderDataForNative();
    }
}

MultiMeshSpriteAssembler.prototype.floatsPerVert = 6;
MultiMeshSpriteAssembler.prototype.texIdOffset = 5;
MultiMeshSpriteAssembler.prototype.isMulti = true;
