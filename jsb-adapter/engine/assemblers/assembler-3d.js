
(function(){
    if(!cc.Assembler3D) return;

    cc.Assembler3D.updateWorldVerts = function (comp) {
            let local = this._local;
            let world = this._renderData.vDatas[0];
            let vl = local[0], vr = local[2], vb = local[1], vt = local[3];

            // left bottom
            let floatsPerVert = this.floatsPerVert;
            let offset = 0;
            world[offset] = vl;
            world[offset+1] = vb;
            world[offset+2] = 0;
            offset += floatsPerVert;

            // right bottom
            world[offset] = vr;
            world[offset+1] = vb;
            world[offset+2] = 0;
            offset += floatsPerVert;

            // left top
            world[offset] = vl;
            world[offset+1] = vt;
            world[offset+2] = 0;
            offset += floatsPerVert;

            // right top
            world[offset] = vr;
            world[offset+1] = vt;
            world[offset+2] = 0;     
    }
})()