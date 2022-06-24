(function(){
    if(!cc.Sprite.__assembler__.Mesh3D) return;

    let proto = cc.Sprite.__assembler__.Mesh3D.prototype;

    Object.assign(proto, { 
        updateWorldVerts (sprite) {
            let local = this._local;
            let world = this._renderData.vDatas[0];
         
            let floatsPerVert = this.floatsPerVert, offset = 0;
            for (let i = 0, j = 0, l = local.length/2; i < l; i++, offset += floatsPerVert) {
                j = i * 2;
                world[offset] = local[j];
                world[offset+1] = local[j+1];
                world[offset+2] = 0;
            }
        }
    })
})()