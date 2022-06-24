(function(){
    if(!cc.Label.__assembler__.TTF3D) return;

    let proto = cc.Label.__assembler__.TTF3D.prototype;

    Object.assign(proto, { 
        updateWorldVerts: cc.Assembler3D.updateWorldVerts
    })
})()