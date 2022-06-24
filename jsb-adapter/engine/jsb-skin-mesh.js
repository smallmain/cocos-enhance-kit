(function(){
    if (!cc.SkinnedMeshRenderer) return;

    let SkinnedMeshAssembler = cc.SkinnedMeshRenderer.__assembler__.prototype;
    cc.js.mixin(SkinnedMeshAssembler, {
        updateRenderData (comp) {
            comp.calcJointMatrix();
            comp.node._renderFlag |= cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
        },
    });
})();