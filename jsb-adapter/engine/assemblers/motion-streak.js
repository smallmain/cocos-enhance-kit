
let proto = cc.MotionStreak.__assembler__.prototype;
let _init = proto.init;
let _update = proto.update;
cc.js.mixin(proto, {
    init (comp) {
        _init.call(this, comp);

        this.setUseModel(false);
        this.ignoreWorldMatrix();
        this.ignoreOpacityFlag();
    },
    update (comp, dt) {
        comp.node._updateWorldMatrix();
        
        _update.call(this, comp, dt);

        let { iData, usedVertices } = this._renderData._flexBuffer;
        let indiceOffset = 0;
        for (let i = 0, l = usedVertices; i < l; i += 2) {
            iData[indiceOffset++] = i;
            iData[indiceOffset++] = i + 2;
            iData[indiceOffset++] = i + 1;
            iData[indiceOffset++] = i + 1;
            iData[indiceOffset++] = i + 2;
            iData[indiceOffset++] = i + 3;
        }
    }
});
