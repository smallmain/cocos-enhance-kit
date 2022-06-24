(function(){
    let PS = cc.ParticleSystem3D;
    if (PS === undefined) return;
    let proto = PS.__assembler__.prototype;
    let _init = proto.init;
    let _updateRenderData = proto.updateRenderData;

    cc.js.mixin(proto, {
        initVertexFormat () {},
        
        _extendNative () {
            renderer.Particle3DAssembler.prototype.ctor.call(this);
        },

        init (comp) {
            _init.call(this, comp);

            this._renderDataList = new renderer.RenderDataList();
            this.setRenderDataList(this._renderDataList);
            this.ignoreOpacityFlag();
            this.updateMeshData();
            this.setUseModel(true);
        },

        updateRenderData (comp) {   
            _updateRenderData.call(this, comp);

            if (comp._vertsDirty) {
                this.updateMeshData();
                comp._vertsDirty = false;
            }
        },

        setRenderNode (node) {
            this.setNode(node._proxy);
        },

        updateMeshData () {
            if (!this._model) {
                return;
            }

            let subdatas = this._model._subDatas;
            for(let i = 0, len = subdatas.length; i < len; i++) {
                let data = subdatas[i];
                if (data.vDirty && data.enable) {
                    this._renderDataList.updateMesh(i, data.vData, data.iData);
                }
            }

            this.setVertexFormat(subdatas[0].vfm._nativeObj);
            this.setSimulationSpace(this._particleSystem.simulationSpace);

            if (subdatas[1] && subdatas[1].enable) {
                this.setTrailVertexFormat(subdatas[1].vfm._nativeObj);
                this.setTrailModuleSpace(this._particleSystem.trailModule.space);
            }
        },

        setSimulationSpace (space) {
            this.setParticleSpace(space);
        },

        setTrailModuleSpace (space) {
            this.setTrailSpace(space);
        },

        updateIA (index, count, vDirty, iDirty) {
            this.updateIndicesRange(index, 0, count);
        }

    }, renderer.Particle3DAssembler.prototype);
})();