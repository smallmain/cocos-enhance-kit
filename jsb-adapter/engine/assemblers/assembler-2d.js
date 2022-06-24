cc.Assembler2D.prototype.updateWorldVerts = function(comp) {
    let local = this._local;
    let verts = this._renderData.vDatas[0];
  
    let vl = local[0],
        vr = local[2],
        vb = local[1],
        vt = local[3];
  
    let floatsPerVert = this.floatsPerVert;
    let vertexOffset = 0;
    // left bottom
    verts[vertexOffset] = vl;
    verts[vertexOffset + 1] = vb;
    vertexOffset += floatsPerVert;
    // right bottom
    verts[vertexOffset] = vr;
    verts[vertexOffset + 1] = vb;
    vertexOffset += floatsPerVert;
    // left top
    verts[vertexOffset] = vl;
    verts[vertexOffset + 1] = vt;
    vertexOffset += floatsPerVert;
    // right top
    verts[vertexOffset] = vr;
    verts[vertexOffset + 1] = vt;
};

let _updateColor = cc.Assembler2D.prototype.updateColor;
cc.Assembler2D.prototype.updateColor = function(comp, color) {
    this._dirtyPtr[0] |= cc.Assembler.FLAG_VERTICES_OPACITY_CHANGED;
    _updateColor.call(this, comp, color);
};
