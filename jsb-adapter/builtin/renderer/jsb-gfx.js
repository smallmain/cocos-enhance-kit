/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

  http://www.cocos.com
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/ 
 
import { enums, glTextureFmt } from "./enums";
import VertexFormat from "./jsb-vertex-format";
const gfx = window.gfx;

var _tmpGetSetDesc = {
    get: undefined,
    set: undefined,
    enumerable: true,
    configurable: true
};

/**
 * Device
 */

var deviceInstance;

gfx.Device.prototype.setBlendColor32 = gfx.Device.prototype.setBlendColor;
gfx.Device._getInstance = gfx.Device.getInstance;
gfx.Device.getInstance = function () {
    // init native device instance
    if (!deviceInstance) {
        deviceInstance = gfx.Device._getInstance();
        deviceInstance._gl = window.__gl;
        deviceInstance.ext = function (extName) {
            return window.__gl.getExtension(extName);
        };
    }

    return deviceInstance;
}

//FIXME:
// window.device._stats = { vb: 0 };
// window.device._caps = {
//     maxVextexTextures: 16,
//     maxFragUniforms: 1024,
//     maxTextureUints: 8,
//     maxVertexAttributes: 16,
//     maxDrawBuffers: 8,
//     maxColorAttatchments: 8
// };


/**
 * Program
 */
var _p = gfx.Program.prototype;
_p._ctor = function(device, options) {
    if (device) {
        this.init(device, options.vert, options.frag);
    }
};

/**
 * VertexBuffer
 */
_p = gfx.VertexBuffer.prototype;
_p._ctor = function(device, format, usage, data, numVertices) {
    this._attr2el = format._attr2el;
    if (device && format) {
        this.init(device, format._nativeObj, usage, data, numVertices);
    }
    this._nativePtr = this.self();
};
_p.getFormat = function(name) {
    return this._attr2el[name];
}
_tmpGetSetDesc.get = _p.getCount;
_tmpGetSetDesc.set = undefined;
Object.defineProperty(_p, "count", _tmpGetSetDesc);

/**
 * IndexBuffer
 */
_p = gfx.IndexBuffer.prototype;
_p._ctor = function(device, format, usage, data, numIndices) {
    if (device) {
        this.init(device, format, usage, data, numIndices);
    }
    this._nativePtr = this.self();
};
_tmpGetSetDesc.get = _p.getCount;
_tmpGetSetDesc.set = undefined;
Object.defineProperty(_p, "count", _tmpGetSetDesc);

gfx.VertexFormat = VertexFormat;
Object.assign(gfx, enums);

/**
 * Texture2D
 */
function convertImages(images) {
    if (images) {
        for (let i = 0, len = images.length; i < len; ++i) {
            let image = images[i];
            if (image !== null) {
                if (image instanceof window.HTMLCanvasElement) {
                    if (image._data) {
                        images[i] = image._data._data;
                    }
                    else {
                        images[i] = null;
                    }
                }
                else if (image instanceof window.HTMLImageElement) {
                    images[i] = image._data;
                }
            }
        }
    }
}

function convertOptions(texture, options) {
    let gl = window.__gl;
    if (options.images && options.images[0] instanceof HTMLImageElement) {
        var image = options.images[0];
        options.glInternalFormat = image._glInternalFormat;
        options.glFormat = image._glFormat;
        options.glType = image._glType;
        options.bpp = image._bpp;
        options.compressed = image._compressed;
    }
    else if (options.images && options.images[0] instanceof HTMLCanvasElement) {
        options.glInternalFormat = gl.RGBA;
        options.glFormat = gl.RGBA;
        options.glType = gl.UNSIGNED_BYTE;
        options.bpp = 32;
        options.compressed = false;
    }
    else {
        let format = options.format || texture._format;
        var gltf = glTextureFmt(format);
        options.glInternalFormat = gltf.internalFormat;
        options.glFormat = gltf.format;
        options.glType = gltf.pixelType;
        options.bpp = gltf.bpp;
        options.compressed = 
            (format >= enums.TEXTURE_FMT_RGB_DXT1 && format <= enums.TEXTURE_FMT_RGBA_PVRTC_4BPPV1) ||
            (format >= enums.TEXTURE_FMT_RGB_ETC2 && format <= enums.TEXTURE_FMT_RGBA_ETC2) ||
            (format >= enums.TEXTURE_FMT_RGBA_ASTC_4X4 && format <= enums.TEXTURE_FMT_SRGBA_ASTC_12X12);
    }

    options.width = options.width || texture._width;
    options.height = options.height || texture._height;

    convertImages(options.images);
}

_p = gfx.Texture2D.prototype;
let _textureID = 0;
_p._ctor = function(device, options) {
    if (device) {
        convertOptions(this, options);
        this.init(device, options);
    }
    this._id = _textureID++;
};
_p.destroy = function() { 
};
_p.update = function(options) {
    convertOptions(this, options);
    this.updateNative(options);
};
_p.updateSubImage = function(option) {
    var images = [option.image];
    convertImages(images);
    var data = new Uint32Array(8 + 
                               (images[0].length + 3) / 4);

    data[0] = option.x;
    data[1] = option.y;
    data[2] = option.width;
    data[3] = option.height;
    data[4] = option.level;
    data[5] = option.flipY;
    data[6] = false;
    data[7] = images[0].length;
    var imageData = new Uint8Array(data.buffer);
    imageData.set(images[0], 32);

    this.updateSubImageNative(data);
};
_tmpGetSetDesc.get = _p.getWidth;
_tmpGetSetDesc.set = undefined;
Object.defineProperty(_p, "_width", _tmpGetSetDesc);
_tmpGetSetDesc.get = _p.getHeight;
Object.defineProperty(_p, "_height", _tmpGetSetDesc);

/**
 * FrameBuffer
 */
_p = gfx.FrameBuffer.prototype;
_p._ctor = function(device, width, height, options) {
    if (!device) return;
    this.init(device, width, height, options);

    this._glID = { _id: this.getHandle()};
    this.getHandle = function () {
        return this._glID;
    }
};

/**
 * FrameBuffer
 */
_p = gfx.RenderBuffer.prototype;
_p._ctor = function(device, format, width, height) {
    if (!device) return;
    this.init(device, format, width, height);

    this._glID = { _id: this.getHandle()};
    this.getHandle = function () {
        return this._glID;
    }
};

gfx.RB_FMT_D16 = 0x81A5; // GL_DEPTH_COMPONENT16 hack for JSB

export default gfx;