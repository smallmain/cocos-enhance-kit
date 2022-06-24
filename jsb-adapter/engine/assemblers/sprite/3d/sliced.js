(function(){
    if(!cc.Sprite.__assembler__.Sliced3D) return;

    let proto = cc.Sprite.__assembler__.Sliced3D.prototype;
    let nativeProto = renderer.SlicedSprite3D.prototype;

    Object.assign(proto, {
        _extendNative: nativeProto.ctor
    })
})()