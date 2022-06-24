// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
(function () {
    if (!cc.EffectVariant) return;

    let EffectVariant = cc.EffectVariant;
    let _init = EffectVariant.prototype.init;

    Object.assign(EffectVariant.prototype, {
        init (effect) {
            _init.call(this, effect);

            this._nativeObj = new renderer.EffectVariant(effect._nativeObj);
        },

        _onEffectChanged () {
            let nativeEffect = this._effect ? this._effect._nativeObj : null;
            this._nativeObj.setEffect(nativeEffect);
        },

        updateHash (hash) {
            this._nativeObj.updateHash(hash);
        }
    })
})();
