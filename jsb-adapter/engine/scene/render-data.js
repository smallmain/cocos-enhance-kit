
let proto = cc.RenderData.prototype;
cc.RenderData.prototype.init = function (assembler) {
    this._renderDataList = new renderer.RenderDataList();
    assembler.setRenderDataList(this._renderDataList);
    this._nativeAssembler = assembler;
};

let originClear = proto.clear;
proto.clear = function () {
    originClear.call(this);
    this._renderDataList.clear();
};

let originUpdateMesh = proto.updateMesh;
proto.updateMesh = function (meshIndex, vertices, indices) {
    originUpdateMesh.call(this, meshIndex, vertices, indices);

    if (vertices && indices) {
        this._renderDataList.updateMesh(meshIndex, vertices, indices);
    }
}

proto.updateMeshRange = function (verticesCount, indicesCount) {
    this._nativeAssembler.updateVerticesRange(0, 0, verticesCount);
    this._nativeAssembler.updateIndicesRange(0, 0, indicesCount);
}
