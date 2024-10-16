if (cc.Texture2D) {
    cc.Texture2D.prototype._checkPackable = function () {
        let dynamicAtlas = cc.dynamicAtlasManager;
        if (!dynamicAtlas) return;

        if (this._isCompressed()) {
            this._packable = false;
            return;
        }

        let w = this.width, h = this.height;
        if (!this._image ||
            w > dynamicAtlas.maxFrameSize || h > dynamicAtlas.maxFrameSize || 
            this._getHash() !== dynamicAtlas.Atlas.DEFAULT_HASH) {
            this._packable = false;
            return;
        }

        // HACK: Can't tell if it's a Canvas or an Image by instanceof on Baidu.
        if (this._image && this._image.getContext) {
            this._packable = true;
        }
    };
}