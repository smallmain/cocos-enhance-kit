(function(){
    if(!cc.Label.__assembler__.Letter3D) return;

    let proto = cc.Label.__assembler__.Letter3D.prototype;

    Object.assign(proto, { 
        updateWorldVerts (comp) {
            let local = this._local;
            let world = this._renderData.vDatas[0];
    
            let floatsPerVert = this.floatsPerVert;
            for (let offset = 0, l = world.length; offset < l; offset += floatsPerVert) {
                world[offset] = local[offset];
                world[offset+1] = local[offset+1];
                world[offset+2] = 0;
            }
        }
    })
})()