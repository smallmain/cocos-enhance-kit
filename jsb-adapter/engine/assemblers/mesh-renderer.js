(function(){
    let Mesh = cc.MeshRenderer;
    if (Mesh === undefined) return;
    let proto = cc.MeshRenderer.__assembler__.prototype;
    let _init = proto.init;
    cc.js.mixin(proto, {
        initVertexFormat () {},
        
        _extendNative () {
            renderer.MeshAssembler.prototype.ctor.call(this);
        },

        init (comp) {
            _init.call(this, comp);
            this.updateMeshData(true);
        },

        setRenderNode (node) {
            this.setNode(node._proxy);
        },

        updateRenderData (comp) {
            this.updateMeshData();
            comp.node._renderFlag |= cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
        },

        updateMeshData (force) {
            let comp = this._renderComp;
            let mesh = comp.mesh;
            if (!mesh || !mesh.loaded) return;

            let subdatas = comp.mesh.subDatas;
            for(let i = 0, len = subdatas.length; i < len; i++) {
                let data = subdatas[i];
                if (force || data.vDirty || data.iDirty) {
                    this.updateIAData(i, data.vfm._nativeObj, data.vData, data.iData);
                    data.vDirty = false;
                    data.iDirty = false;
                }
            }
        }
    }, renderer.MeshAssembler.prototype);
})();