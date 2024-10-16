if (cc && cc.Label) {
    const gfx = cc.gfx;
    const Label = cc.Label;

    // shared label canvas
    let _sharedLabelCanvas = my.createOffscreenCanvas();
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

    let _originUpdateMaterial = Label.prototype._updateMaterialWebgl;
    // fix ttf font black border
    Object.assign(Label.prototype, {
        _updateMaterialWebgl () {
            _originUpdateMaterial.call(this);

            // init blend factor
            let material = this._materials[0];
            if (!this._frame || !material) {
                return;
            }
            let dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;
            let srcBlendFactor;
            if (!(__globalAdapter.isDevTool || this.font instanceof cc.BitmapFont)) {
                // Premultiplied alpha on runtime
                srcBlendFactor = cc.macro.BlendFactor.ONE;
            }
            else {
                srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
            }

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