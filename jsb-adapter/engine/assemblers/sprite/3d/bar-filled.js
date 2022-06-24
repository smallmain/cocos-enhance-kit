(function(){
    if(!cc.Sprite.__assembler__.BarFilled3D) return;

    let proto = cc.Sprite.__assembler__.BarFilled3D.prototype;

    Object.assign(proto, { 
        updateWorldVerts: cc.Assembler3D.updateWorldVerts
    })
})()