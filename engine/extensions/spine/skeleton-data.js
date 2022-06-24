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

        createRegion(spriteFrame, original = undefined) {
            const region = new sp.spine.TextureAtlasRegion();

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

            if (original) {
                region.name = original.name;
                region.page = original.page;
            }

            region.x = rect.x;
            region.y = rect.y;
            region.width = rect.width;
            region.height = rect.height;
            region.originalWidth = origSize.width;
            region.originalHeight = origSize.height;
            region.offsetX = offset.x;
            region.offsetY = offset.y;
            region.rotate = degrees != 0;
            region.degrees = degrees;

            const skelTex = new sp.SkeletonTexture({
                width: texture.width,
                height: texture.height,
            });
            skelTex.setRealTexture(texture);
            region.texture = skelTex;

            this.updateRegionUV(region);

            return region;
        },

        updateRegionUV(region) {
            const texture = region.texture._texture;
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
        },

        createSpriteFrame(region) {
            const frame = new cc.SpriteFrame(
                region.texture._texture,
                cc.rect(region.x, region.y, region.width, region.height),
                region.rotate,  // 如果 region 不是 0 或 270 则会出现问题
                cc.v2(region.offsetX - (region.originalWidth - region.width) * 0.5, region.offsetY - (region.originalHeight - region.height) * 0.5),
                cc.size(region.originalWidth, region.originalHeight),
            );
            return frame;
        },
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
        this._cloneId = 0;
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
        cloned._cloneId = this._cloneId + 1;
        const suffix = '(clone ' + String(cloned._cloneId) + ')';
        cloned._uuid = this._uuid + suffix;
        cloned.name = this.name + suffix;
        cloned.scale = this.scale;
        cloned.textureNames = this.textureNames;
        cloned.textures = this.textures;
        cloned._atlasText = this._atlasText;
        cloned._skeletonJson = this._skeletonJson;
        cloned._buffer = this._buffer;

        return cloned;
    },

    destroy() {
        // 删除动态图集
        if (this._atlasCache) {
            const regions = this._atlasCache.regions;
            for (const region of regions) {
                if (region._spriteFrame) {
                    region._spriteFrame.destroy();
                    region._spriteFrame = null;
                }
            }
        }
        if (this._skeletonCache) {
            const skins = this._skeletonCache.skins;
            for (const skin of skins) {
                for (const attachments of skin.attachments) {
                    for (const key in attachments) {
                        const region = attachments[key].region;
                        if (region && region._spriteFrame) {
                            region._spriteFrame.destroy();
                            region._spriteFrame = null;
                        }
                    }
                }
            }
        }
        SkeletonCache.removeSkeleton(this._uuid);
        this._super();
    },
});

sp.SkeletonData = module.exports = SkeletonData;
