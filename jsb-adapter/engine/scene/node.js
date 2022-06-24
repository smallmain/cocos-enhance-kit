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

'use strict';

let RenderFlow = cc.RenderFlow;
const LOCAL_TRANSFORM = RenderFlow.FLAG_LOCAL_TRANSFORM;
const COLOR = RenderFlow.FLAG_COLOR;
const UPDATE_RENDER_DATA = RenderFlow.FLAG_UPDATE_RENDER_DATA;

const POSITION_ON = 1 << 0;

cc.Node.prototype.setLocalDirty = function (flag) {
    this._localMatDirty |= flag;
    this._worldMatDirty = true;
    this._dirtyPtr[0] |= RenderFlow.FLAG_TRANSFORM;
};

cc.js.getset(cc.Node.prototype, "_renderFlag", 
    function () {
        return this._dirtyPtr[0];
    },
    function (flag) {
        this._dirtyPtr[0] = flag;
        if (flag & UPDATE_RENDER_DATA || flag & COLOR) {
            cc.RenderFlow.register(this);
        }
    }
);

cc.PrivateNode.prototype._posDirty = function (sendEvent) {
    let parent = this.parent;
    if (parent) {
        // Position correction for transform calculation
        this._trs[0] = this._originPos.x - (parent._anchorPoint.x - 0.5) * parent._contentSize.width;
        this._trs[1] = this._originPos.y - (parent._anchorPoint.y - 0.5) * parent._contentSize.height;
    }

    this.setLocalDirty(cc.Node._LocalDirtyFlag.POSITION);
    if (sendEvent === true && (this._eventMask & POSITION_ON)) {
        this.emit(cc.Node.EventType.POSITION_CHANGED);
    }
};
