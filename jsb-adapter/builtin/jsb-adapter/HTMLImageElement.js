const HTMLElement = require('./HTMLElement');
const Event = require('./Event');
const gl = window.__gl;

class HTMLImageElement extends HTMLElement {
    constructor(width, height, isCalledFromImage) {
        if (!isCalledFromImage) {
            throw new TypeError("Illegal constructor, use 'new Image(w, h); instead!'");
            return;
        }
        super('img')
        this.width = width ? width : 0;
        this.height = height ? height : 0;
        this._data = null;
        this._src = null;
        this.complete = false;
        this._glFormat = this._glInternalFormat = gl.RGBA;
        this.crossOrigin = null;
    }

    set src(src) {
        this._src = src;
        jsb.loadImage(src, (info) => {
            if (!info) {
                this._data = null;
                return;
            } else if (info && info.errorMsg) {
                this._data = null;
                var event = new Event('error');
                this.dispatchEvent(event);
                return;
            }

            this.width = this.naturalWidth = info.width;
            this.height = this.naturalHeight = info.height;
            this._data = info.data;
            // console.log(`glFormat: ${info.glFormat}, glInternalFormat: ${info.glInternalFormat}, glType: ${info.glType}`);
            this._glFormat = info.glFormat;
            this._glInternalFormat = info.glInternalFormat;
            this._glType = info.glType;
            this._numberOfMipmaps = info.numberOfMipmaps;
            this._compressed = info.compressed;
            this._bpp = info.bpp;
            this._premultiplyAlpha = info.premultiplyAlpha;

            this._alignment = 1;
            // Set the row align only when mipmapsNum == 1 and the data is uncompressed
            if ((this._numberOfMipmaps == 0 || this._numberOfMipmaps == 1) && !this._compressed) {
                const bytesPerRow = this.width * this._bpp / 8;
                if (bytesPerRow % 8 == 0)
                    this._alignment = 8;
                else if (bytesPerRow % 4 == 0)
                    this._alignment = 4;
                else if (bytesPerRow % 2 == 0)
                    this._alignment = 2;
            }

            this.complete = true;

            var event = new Event('load');
            this.dispatchEvent(event);
        });
    }

    get src() {
        return this._src;
    }

    get clientWidth() {
        return this.width;
    }

    get clientHeight() {
        return this.height;
    }

    getBoundingClientRect() {
        return new DOMRect(0, 0, this.width, this.height);
    }
}

module.exports = HTMLImageElement;
