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

(function(){
    if (!cc.TiledMap) return;

    const RenderFlow = cc.RenderFlow;

    // tiled layer
    let TiledLayer = cc.TiledLayer.prototype;

    let _addUserNode = TiledLayer.addUserNode;
    TiledLayer.addUserNode = function (node) {
        let result = _addUserNode.call(this, node);
        if (result) {
            let proxy = node._proxy;
            proxy && proxy.enableVisit(false);
        }
    };

    let _removeUserNode = TiledLayer.removeUserNode;
    TiledLayer.removeUserNode = function (node) {
        let result = _removeUserNode.call(this, node);
        if (result) {
            let proxy = node._proxy;
            proxy && proxy.enableVisit(true);
        }
    };

    // override _buildMaterial to upload hash value to native
    let _buildMaterial = TiledLayer._buildMaterial;
    TiledLayer._buildMaterial = function (tilesetIdx) {
        let material = _buildMaterial.call(this, tilesetIdx);
        if (material) material.getHash();
    };

    // tiledmap buffer
    let TiledMapBuffer = cc.TiledMapBuffer.prototype;
    TiledMapBuffer._updateOffset = function () {
        let offsetInfo = this._offsetInfo;
        offsetInfo.vertexOffset = this.vertexOffset;
        offsetInfo.indiceOffset = this.indiceOffset;
        offsetInfo.byteOffset = this.byteOffset;
    };

    // tiledmap render data list
    let TiledMapRenderDataList = cc.TiledMapRenderDataList.prototype;
    TiledMapRenderDataList._pushRenderData = function () {
        let renderData = {};
        renderData.ia = {};
        renderData.nodesRenderList = [];
        this._dataList.push(renderData);
    };

    TiledMapRenderDataList.reset = function () {
        this._offset = 0;
        let assembler = this._nativeAssembler;
        assembler._effect.length = 0;
        assembler.reset();
    };

    TiledMapRenderDataList.setNativeAssembler = function (assembler) {
        this._nativeAssembler = assembler;
    };

    TiledMapRenderDataList.popRenderData = function (buffer) {
        if (this._offset >= this._dataList.length) {
            this._pushRenderData();
        }
        let renderData = this._dataList[this._offset];

        renderData.nodesRenderList.length = 0;
        this._nativeAssembler.clearNodes(this._offset);

        let ia = renderData.ia;
        ia._meshIndex = buffer.getCurMeshIndex();
        ia._start = buffer.indiceOffset;
        ia._count = 0;
        ia._verticesStart = buffer.vertexOffset;
        ia._index = this._offset;
        this._offset++;
        return renderData;
    };

    TiledMapRenderDataList.pushNodesList = function (renderData, nodesList) {
        let nodesRenderList = renderData.nodesRenderList;
        nodesRenderList.push(nodesList);

        let nativeNodes = [];
        for (let j = 0; j < nodesRenderList.length; j++) {
            let nodesList = nodesRenderList[j];
            if (!nodesList) continue;
            for (let idx = 0; idx < nodesList.length; idx++) {
                let dataComp = nodesList[idx];
                if (!dataComp) continue;
                nativeNodes.push(dataComp.node._id);
            }
        }
        this._nativeAssembler.updateNodes(renderData.ia._index, nativeNodes);
    };

    let ModelBatcherDelegate = cc.Class({
        ctor () {
            this._nativeAssembler = null;
        },
        setNativeAssembler (assembler) {
            this._nativeAssembler = assembler;
        },
        setBuffer (buffer) {
            this._buffer = buffer;
        },
        _flushIA (ia) {
            let iaIndex = ia._index;
            let meshIndex = ia._meshIndex;
            this._nativeAssembler.updateMeshIndex(iaIndex, meshIndex);
            let verticesStart = ia._verticesStart;
            let verticesOffset = this._buffer.vertexOffset;
            let vertexCount = verticesOffset - verticesStart;
            this._nativeAssembler.updateVerticesRange(iaIndex, verticesStart, vertexCount);
            this._nativeAssembler.updateIndicesRange(iaIndex, ia._start, ia._count);
            this._nativeAssembler.updateMaterial(iaIndex, this.material);
        },
        _flush () {}
    });

    let TiledMapAssembler = cc.TiledLayer.__assembler__.prototype;
    let _fillBuffers = TiledMapAssembler.fillBuffers;
    cc.js.mixin(TiledMapAssembler, {
        _extendNative () {
            renderer.TiledMapAssembler.prototype.ctor.call(this);
        },

        // override _updateRenderData function avoid base class cover material
        _updateRenderData () {
            if (!this._renderComp || !this._renderComp.isValid) return;
            this.updateRenderData(this._renderComp);
        },

        updateRenderData (comp) {
            if (!comp._modelBatcherDelegate) {
                comp._buffer = new cc.TiledMapBuffer(null, cc.gfx.VertexFormat.XY_UV_Color);
                comp._renderDataList = new cc.TiledMapRenderDataList();
                comp._modelBatcherDelegate = new ModelBatcherDelegate();
    
                comp._buffer.setNativeAssembler(this);
                comp._renderDataList.setNativeAssembler(this);
                comp._modelBatcherDelegate.setBuffer(comp._buffer);
                comp._modelBatcherDelegate.setNativeAssembler(this);
            }
            
            _fillBuffers.call(this, comp, comp._modelBatcherDelegate);
            comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
        }
    }, renderer.TiledMapAssembler.prototype);
})();
