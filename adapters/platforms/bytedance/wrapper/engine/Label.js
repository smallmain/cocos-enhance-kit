if (cc && cc.Label) {
    const gfx = cc.gfx;
    const Label = cc.Label;
    const globalAdapter = __globalAdapter;
    // shared label canvas
    if (!globalAdapter.isSubContext) {
        let _sharedLabelCanvas = document.createElement('canvas');
        let _sharedLabelCanvasCtx = _sharedLabelCanvas.getContext('2d');
        let canvasData = {
            canvas: _sharedLabelCanvas,
            context: _sharedLabelCanvasCtx,
        };
        cc.game.on(cc.game.EVENT_ENGINE_INITED, function () {
            Object.assign(Label._canvasPool, {
                get() {
                    return canvasData;
                },
    
                put() {
                    // do nothing
                }
            });
        });
    }

    // need to fix ttf font black border at the sdk verion lower than 2.0.0
    let sysInfo = tt.getSystemInfoSync();
    if (Number.parseInt(sysInfo.SDKVersion[0]) < 2) {
        let _originUpdateMaterial = Label.prototype._updateMaterialWebgl;
        Object.assign(Label.prototype, {
            _updateMaterialWebgl () {
                _originUpdateMaterial.call(this);
                // only fix when srcBlendFactor is SRC_ALPHA
                if (this.srcBlendFactor !== cc.macro.BlendFactor.SRC_ALPHA
                    || globalAdapter.isDevTool || this.font instanceof cc.BitmapFont) {
                    return;
                }
    
                // init blend factor
                let material = this._materials[0];
                if (!this._frame || !material) {
                    return;
                }
                let dstBlendFactor = this.dstBlendFactor;
                // Premultiplied alpha on runtime when sdk verion is lower than 2.0.0
                let srcBlendFactor = cc.macro.BlendFactor.ONE;
    
                // set blend func
                material.effect.setBlend(
                    true,
                    gfx.BLEND_FUNC_ADD,
                    srcBlendFactor, dstBlendFactor,
                    gfx.BLEND_FUNC_ADD,
                    srcBlendFactor, dstBlendFactor,
                );
            },
        });
    }
}