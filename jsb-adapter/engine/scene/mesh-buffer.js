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
    if (!cc.MeshBuffer) return;
    let MeshBuffer = cc.MeshBuffer.prototype;

    MeshBuffer.init = function (batcher, vertexFormat) {
        this.byteOffset = 0;
        this.indiceOffset = 0;
        this.vertexOffset = 0;

        this._vertexFormat = vertexFormat;
        this._vertexBytes = this._vertexFormat._bytes;

        this._vDatas = [];
        this._uintVDatas = [];
        this._iDatas = [];
        this._arrOffset = 0;

        this._vData = null;
        this._uintVData = null;
        this._iData = null;

        this._initVDataCount = 256 * vertexFormat._bytes;// actually 256 * 4 * (vertexFormat._bytes / 4)
        this._initIDataCount = 256 * 6;
        
        this._offsetInfo = {
            byteOffset : 0,
            vertexOffset : 0,
            indiceOffset : 0
        };

        this._renderDataList = new renderer.RenderDataList();
        this._reallocBuffer();
    };

    MeshBuffer.setNativeAssembler = function(assembler) {
        if (assembler !== this._nativeAssembler) {
            this._nativeAssembler = assembler;
            assembler.setRenderDataList(this._renderDataList);
        }
    };

    MeshBuffer._updateVIDatas = function() {
        let offset = this._arrOffset;
        this._vDatas[offset] = this._vData;
        this._uintVDatas[offset] = this._uintVData;
        this._iDatas[offset] = this._iData;
        this._renderDataList.updateMesh(offset, this._vData, this._iData);
    };

    MeshBuffer.getNativeAssembler = function() {
        return this._nativeAssembler;
    };

    MeshBuffer.getCurMeshIndex = function() {
        return this._arrOffset;
    };

    MeshBuffer.uploadData = function() {};

    MeshBuffer.switchBuffer = function() {
        let offset = ++this._arrOffset;

        this.byteOffset = 0;
        this.vertexOffset = 0;
        this.indiceOffset = 0;

        if (offset < this._vDatas.length) {
            this._vData = this._vDatas[offset];
            this._uintVData = this._uintVDatas[offset];
            this._iData = this._iDatas[offset];
        } else {
            this._reallocBuffer();
        }
    };

    MeshBuffer.checkAndSwitchBuffer = function(vertexCount) {
        if (this.vertexOffset + vertexCount > 65535) {
            this.switchBuffer();
            if (!this._nativeAssembler) return;
            this._nativeAssembler.updateIADatas && this._nativeAssembler.updateIADatas(this._arrOffset, this._arrOffset);
        }
    };

    MeshBuffer.used = function(vertexCount, indiceCount) {
        if (!this._nativeAssembler) return;
        this._nativeAssembler.updateVerticesRange(this._arrOffset, 0, vertexCount);
        this._nativeAssembler.updateIndicesRange(this._arrOffset, 0, indiceCount);
    };

    MeshBuffer.request = function(vertexCount, indiceCount) {
        this.requestStatic(vertexCount, indiceCount);
        return this._offsetInfo;
    };

    MeshBuffer._reallocBuffer = function() {
        this._reallocVData(true);
        this._reallocIData(true);
        this._updateVIDatas();
    };

    MeshBuffer._reallocVData = function(copyOldData) {
        let oldVData;
        if (this._vData) {
            oldVData = new Uint8Array(this._vData.buffer);
        }

        this._vData = new Float32Array(this._initVDataCount);
        this._uintVData = new Uint32Array(this._vData.buffer);

        let newData = new Uint8Array(this._uintVData.buffer);

        if (oldVData && copyOldData) {
            for (let i = 0, l = oldVData.length; i < l; i++) {
                newData[i] = oldVData[i];
            }
        }
    };

    MeshBuffer._reallocIData = function(copyOldData) {
        let oldIData = this._iData;

        this._iData = new Uint16Array(this._initIDataCount);

        if (oldIData && copyOldData) {
            let iData = this._iData;
            for (let i = 0, l = oldIData.length; i < l; i++) {
                iData[i] = oldIData[i];
            }
        }
    };

    MeshBuffer.reset = function() {
        this._arrOffset = 0;
        this._vData = this._vDatas[0];
        this._uintVData = this._uintVDatas[0];
        this._iData = this._iDatas[0];

        this.byteOffset = 0;
        this.indiceOffset = 0;
        this.vertexOffset = 0;

        if (!this._nativeAssembler) return;

        for (let i = 0, len = this._vDatas.length; i < len; i++) {
            this._nativeAssembler.updateVerticesRange(i, 0, 0);
            this._nativeAssembler.updateIndicesRange(i, 0, 0);
        }
    };

    MeshBuffer.destroy = function() {
        this.reset();
    };
})();