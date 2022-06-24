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

Object.assign(cc.Sprite.__assembler__.Tiled.prototype, {
    updateWorldVerts (sprite) {
        let renderData = this._renderData;
        let local = this._local;
        let localX = local.x, localY = local.y;
        let world = renderData.vDatas[0];
        let { row, col } = this;

        let x, x1, y, y1;
        let floatsPerVert = this.floatsPerVert;
        let vertexOffset = 0;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = localY[yindex];
            y1 = localY[yindex + 1];
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                x = localX[xindex];
                x1 = localX[xindex + 1];

                // lb
                world[vertexOffset] = x;
                world[vertexOffset + 1] = y;
                vertexOffset += floatsPerVert;
                // rb
                world[vertexOffset] = x1;
                world[vertexOffset + 1] = y;
                vertexOffset += floatsPerVert;
                // lt
                world[vertexOffset] = x;
                world[vertexOffset + 1] = y1;
                vertexOffset += floatsPerVert;
                // rt
                world[vertexOffset] = x1;
                world[vertexOffset + 1] = y1;
                vertexOffset += floatsPerVert;
            }
        }
    },
});
