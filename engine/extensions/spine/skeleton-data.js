/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * @module sp
 */
let SkeletonCache = !CC_JSB && require('./skeleton-cache').sharedCache;

/**
 * Spine Attachment 的 Region 数据
 */
class RegionData {

    static middlewareTextureID = -1;

    static updateUV(region) {
        const texture = CC_JSB ? region.texture2D : region.texture._texture;
        if (region.rotate) {
            region.u = region.x / texture.width;
            region.v = region.y / texture.height;
            region.u2 = (region.x + region.height) / texture.width;
            region.v2 = (region.y + region.width) / texture.height;
        } else {
            region.u = region.x / texture.width;
            region.v = region.y / texture.height;
            region.u2 = (region.x + region.width) / texture.width;
            region.v2 = (region.y + region.height) / texture.height;
        }
    }

    x;
    y;
    degrees;
    texture;
    texture2D;
    u;
    v;
    u2;
    v2;
    width;
    height;
    rotate;
    offsetX;
    offsetY;
    originalWidth;
    originalHeight;


    constructor(attachmentOrSpriteFrame) {
        if (attachmentOrSpriteFrame instanceof cc.SpriteFrame) {
            this.initWithSpriteFrame(attachmentOrSpriteFrame);
        } else if (attachmentOrSpriteFrame != null) {
            this.initWithAttachment(attachmentOrSpriteFrame);
        }
    }


    initWithSpriteFrame(spriteFrame) {
        const texture = spriteFrame.getTexture();
        const rect = spriteFrame.getRect();
        const origSize = spriteFrame.getOriginalSize();
        const _offset = spriteFrame.getOffset();
        const rotate = spriteFrame.isRotated();
        const offset = cc.v2(
            (origSize.width - rect.width) * 0.5 + _offset.x,
            (origSize.height - rect.height) * 0.5 + _offset.y,
        );
        const degrees = rotate ? 270 : 0;

        this.x = rect.x;
        this.y = rect.y;
        this.width = rect.width;
        this.height = rect.height;
        this.originalWidth = origSize.width;
        this.originalHeight = origSize.height;
        this.offsetX = offset.x;
        this.offsetY = offset.y;
        this.rotate = degrees != 0;
        this.degrees = degrees;

        this.updateWithTexture2D(texture);
    }


    initWithAttachment(attachment) {
        if (CC_JSB) {
            this.x = attachment.regionX;
            this.y = attachment.regionY;
            this.width = attachment.regionWidth;
            this.height = attachment.regionHeight;
            this.originalWidth = attachment.regionOriginalWidth;
            this.originalHeight = attachment.regionOriginalHeight;
            this.offsetX = attachment.regionOffsetX;
            this.offsetY = attachment.regionOffsetY;
            this.degrees = attachment.regionDegrees;
            this.rotate = this.degrees !== 0;
            this.texture = attachment.textureForJSB;
            this.texture2D = attachment.getTexture2D();
            this.updateUV();
        } else {
            const region = attachment.region;
            this.x = region.x;
            this.y = region.y;
            this.width = region.width;
            this.height = region.height;
            this.originalWidth = region.originalWidth;
            this.originalHeight = region.originalHeight;
            this.offsetX = region.offsetX;
            this.offsetY = region.offsetY;
            this.rotate = region.rotate;
            this.degrees = region.degrees;
            this.texture = region.texture;
            this.texture2D = region.texture._texture;
            this.u = region.u;
            this.u2 = region.u2;
            this.v = region.v;
            this.v2 = region.v2;
        }
    }


    updateUV() {
        RegionData.updateUV(this);
    }


    updateWithPackedFrame(packedFrame) {
        this.x = packedFrame.x;
        this.y = packedFrame.y;
        this.updateWithTexture2D(packedFrame.texture);
    }


    updateWithTexture2D(texture2d) {
        if (CC_JSB) {
            const spTex = new middleware.Texture2D();
            spTex.setRealTextureIndex(RegionData.middlewareTextureID--);
            spTex.setPixelsWide(texture2d.width);
            spTex.setPixelsHigh(texture2d.height);
            spTex.setNativeTexture(texture2d.getImpl());
            this.texture = spTex;
        } else {
            this.texture = new sp.SkeletonTexture({
                width: texture2d.width,
                height: texture2d.height,
            });
            this.texture.setRealTexture(texture2d);
        }

        this.texture2D = texture2d;
        this.updateUV();
    }


    toSpriteFrame(strict) {
        if (strict && (this.degrees !== 270 || this.degrees !== 0)) {
            return null;
        }

        const frame = new cc.SpriteFrame(
            this.texture2D,
            cc.rect(this.x, this.y, this.width, this.height),
            this.rotate,  // 如果 region 不是 0 或 270 则会出现问题
            cc.v2(this.offsetX - (this.originalWidth - this.width) * 0.5, this.offsetY - (this.originalHeight - this.height) * 0.5),
            cc.size(this.originalWidth, this.originalHeight),
        );

        return frame;
    }


    assignToAttachment(attachment, strict = true, resetDynamicAtlas = true) {
        if (CC_JSB) {
            if (resetDynamicAtlas) {
                // 如果有在使用动态合图则先还原
                if (attachment && attachment._spriteFrame) {
                    const spriteFrame = attachment._spriteFrame;
                    attachment._spriteFrame = null;
                    spriteFrame.destroy();
                }
            }
            attachment._texture2D = this.texture2D;
            attachment.setRegionForJSB(this.texture, { x: this.x, y: this.y, w: this.width, h: this.height }, cc.size(this.originalWidth, this.originalHeight), cc.v2(this.offsetX, this.offsetY), this.degrees);
        } else {
            const region = attachment.region;

            if (resetDynamicAtlas) {
                // 如果有在使用动态合图则先还原
                if (region && region._spriteFrame) {
                    const spriteFrame = region._spriteFrame;
                    region._spriteFrame = null;
                    spriteFrame.destroy();
                }
            }
         
            if (strict) {
                region.x = this.x;
                region.y = this.y;
                region.width = this.width;
                region.height = this.height;
                region.originalWidth = this.originalWidth;
                region.originalHeight = this.originalHeight;
                region.offsetX = this.offsetX;
                region.offsetY = this.offsetY;
                region.rotate = this.rotate;
                region.degrees = this.degrees;
                region.texture = this.texture;
                region.u = this.u;
                region.u2 = this.u2;
                region.v = this.v;
                region.v2 = this.v2;
            }

            if (attachment instanceof sp.spine.MeshAttachment) {
                attachment.updateUVs();
            } else if (attachment instanceof sp.spine.RegionAttachment) {
                attachment.setRegion(region);
                attachment.updateOffset();
            }
        }
    }


    reset() {
        this.texture = null;
        this.texture2D = null;
    }

}

/**
 * !#en The skeleton data of spine.
 * !#zh Spine 的 骨骼数据。
 * @class SkeletonData
 * @extends Asset
 */
let SkeletonData = cc.Class({
    name: 'sp.SkeletonData',
    extends: cc.Asset,

    ctor: function () {
        this.reset();
    },

    properties: {
        _skeletonJson: null,

        // use by jsb
        skeletonJsonStr: {
            get: function () {
                if (this._skeletonJson) {
                    return JSON.stringify(this._skeletonJson);
                } else {
                    return "";
                }
            }
        },

        /**
         * !#en See http://en.esotericsoftware.com/spine-json-format
         * !#zh 可查看 Spine 官方文档 http://zh.esotericsoftware.com/spine-json-format
         * @property {Object} skeletonJson
         */
        skeletonJson: {
            get: function () {
                return this._skeletonJson;
            },
            set: function (value) {
                this.reset();
                if (typeof(value) == "string") {
                    this._skeletonJson = JSON.parse(value);
                } else {
                    this._skeletonJson = value;
                }
                // If create by manual, uuid is empty.
                if (!this._uuid && value.skeleton) {
                    this._uuid = value.skeleton.hash;
                }
            }
        },

        _atlasText: "",

        /**
         * @property {String} atlasText
         */
        atlasText: {
            get: function () {
                return this._atlasText;
            },
            set: function (value) {
                this._atlasText = value;
                this.reset();
            }
        },

        /**
         * @property {Texture2D[]} textures
         */
        textures: {
            default: [],
            type: [cc.Texture2D]
        },

        /**
         * @property {String[]} textureNames
         * @private
         */
        textureNames: {
            default: [],
            type: [cc.String]
        },

        /**
         * !#en
         * A scale can be specified on the JSON or binary loader which will scale the bone positions,
         * image sizes, and animation translations.
         * This can be useful when using different sized images than were used when designing the skeleton
         * in Spine. For example, if using images that are half the size than were used in Spine,
         * a scale of 0.5 can be used. This is commonly used for games that can run with either low or high
         * resolution texture atlases.
         * see http://en.esotericsoftware.com/spine-using-runtimes#Scaling
         * !#zh 可查看 Spine 官方文档： http://zh.esotericsoftware.com/spine-using-runtimes#Scaling
         * @property {Number} scale
         */
        scale: 1,

        _nativeAsset: {
            get () {
                return this._buffer;
            },
            set (bin) {
                this._buffer = bin.buffer || bin;
                this.reset();
            },
            override: true
        },
    },

    statics: {
        preventDeferredLoadDependents: true,
        cloneId: 0,
    },

    // PUBLIC

    createNode: CC_EDITOR && function (callback) {
        let node = new cc.Node(this.name);
        let skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = this;

        return callback(null, node);
    },

    reset: function () {
        /**
         * @property {sp.spine.SkeletonData} _skeletonData
         * @private
         */
        this._skeletonCache = null;
        /**
         * @property {sp.spine.Atlas} _atlasCache
         * @private
         */
        this._atlasCache = null;
        if (CC_EDITOR) {
            this._skinsEnum = null;
            this._animsEnum = null;
        }
    },

    ensureTexturesLoaded (loaded, caller) {
        let textures = this.textures;
        let texsLen = textures.length;
        if (texsLen == 0) {
            loaded.call(caller, false);
            return;
        }
        let loadedCount = 0;
        let loadedItem = function () {
            loadedCount++;
            if (loadedCount >= texsLen) {
                loaded && loaded.call(caller, true);
                loaded = null;
            }
        }
        for (let i = 0; i < texsLen; i++) {
            let tex = textures[i];
            if (tex.loaded) {
                loadedItem();
            } else {
                tex.once('load', loadedItem);
            }
        }
    },

    isTexturesLoaded () {
        let textures = this.textures;
        let texsLen = textures.length;
        for (let i = 0; i < texsLen; i++) {
            let tex = textures[i];
            if (!tex.loaded) {
                return false;
            }
        }
        return true;
    },

    /**
     * !#en Get the included SkeletonData used in spine runtime.<br>
     * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.SkeletonData object.
     * !#zh 获取 Spine Runtime 使用的 SkeletonData。<br>
     * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.SkeletonData 对象。
     * @method getRuntimeData
     * @param {Boolean} [quiet=false]
     * @return {sp.spine.SkeletonData}
     */
    getRuntimeData: function (quiet) {
        if (this._skeletonCache) {
            return this._skeletonCache;
        }

        if ( !(this.textures && this.textures.length > 0) && this.textureNames && this.textureNames.length > 0 ) {
            if ( !quiet ) {
                cc.errorID(7507, this.name);
            }
            return null;
        }

        let atlas = this._getAtlas(quiet);
        if (! atlas) {
            return null;
        }
        let attachmentLoader = new sp.spine.AtlasAttachmentLoader(atlas);

        let resData = null;
        let reader = null;
        if (this.skeletonJson) {
            reader = new sp.spine.SkeletonJson(attachmentLoader);
            resData = this.skeletonJson;
        } else {
            reader = new sp.spine.SkeletonBinary(attachmentLoader);
            resData = new Uint8Array(this._nativeAsset);
        }

        reader.scale = this.scale;
        this._skeletonCache = reader.readSkeletonData(resData);
        atlas.dispose();

        return this._skeletonCache;
    },

    // EDITOR

    getSkinsEnum: CC_EDITOR && function () {
        if (this._skinsEnum) {
            return this._skinsEnum;
        }
        let sd = this.getRuntimeData(true);
        if (sd) {
            let skins = sd.skins;
            let enumDef = {};
            for (let i = 0; i < skins.length; i++) {
                let name = skins[i].name;
                enumDef[name] = i;
            }
            return this._skinsEnum = cc.Enum(enumDef);
        }
        return null;
    },

    getAnimsEnum: CC_EDITOR && function () {
        if (this._animsEnum) {
            return this._animsEnum;
        }
        let sd = this.getRuntimeData(true);
        if (sd) {
            let enumDef = { '<None>': 0 };
            let anims = sd.animations;
            for (let i = 0; i < anims.length; i++) {
                let name = anims[i].name;
                enumDef[name] = i + 1;
            }
            return this._animsEnum = cc.Enum(enumDef);
        }
        return null;
    },

    // PRIVATE

    _getTexture: function (line) {
        let names = this.textureNames;
        for (let i = 0; i < names.length; i++) {
            if (names[i] === line) {
                let texture = this.textures[i];
                let tex = new sp.SkeletonTexture({ width: texture.width, height: texture.height });
                tex.setRealTexture(texture);
                return tex;
            }
        }
        cc.errorID(7506, line);
        return null;
    },

    /**
     * @method _getAtlas
     * @param {boolean} [quiet=false]
     * @return {sp.spine.Atlas}
     * @private
     */
    _getAtlas: function (quiet) {
        if (this._atlasCache) {
            return this._atlasCache;
        }

        if ( !this.atlasText ) {
            if ( !quiet ) {
                cc.errorID(7508, this.name);
            }
            return null;
        }

        return this._atlasCache = new sp.spine.TextureAtlas(this.atlasText, this._getTexture.bind(this));
    },

    /**
     * 克隆 SkeletonData
     */
    clone: function () {
        const cloned = new SkeletonData();
        SkeletonData.cloneId++;
        const suffix = '(clone ' + String(SkeletonData.cloneId) + ')';
        cloned._uuid = this._uuid.split('(')[0] + suffix;
        cloned.name = this.name + suffix;
        cloned.scale = this.scale;

        cloned._atlasText = this._atlasText;
        cloned.textureNames = this.textureNames;
        cloned._skeletonJson = this._skeletonJson;
        cloned.textures = this.textures;
        if (CC_JSB) {
            const realUuid = cloned._uuid;
            cloned._uuid = this._uuid;
            cloned._nativeUrl = this._nativeUrl;
            cloned._native = this._native;
            cloned.nativeUrl;                       // 触发 nativeUrl getter
            cloned._uuid = realUuid;
        } else {
            cloned._buffer = this._buffer;
        }
        cloned.getRuntimeData();

        return cloned;
    },

    _destroyFromDynamicAtlas() {
        if (this._skeletonCache) {
            const skins = this._skeletonCache.skins;
            for (const skin of skins) {
                for (const attachments of skin.attachments) {
                    for (const key in attachments) {
                        const region = CC_JSB ? attachments[key] : attachments[key].region;
                        if (region && region._spriteFrame) {
                            const spriteFrame = region._spriteFrame;
                            region._spriteFrame = null;
                            spriteFrame.destroy();
                        }
                    }
                }
            }
        }
    },

    destroy() {
        this._destroyFromDynamicAtlas();
        SkeletonCache.removeSkeleton(this._uuid);
        this._super();
    },
});

sp.SkeletonData = module.exports = SkeletonData;
sp.RegionData = RegionData;
