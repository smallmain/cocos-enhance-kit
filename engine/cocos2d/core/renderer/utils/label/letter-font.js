/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

import WebglBmfontAssembler from '../../webgl/assemblers/label/2d/bmfont';
import { vfmtPosUvColorTexId } from '../../webgl/vertex-format';

const Label = require('../../../components/CCLabel');
const LabelOutline = require('../../../components/CCLabelOutline');
const textUtils = require('../../../utils/text-utils');
const Component = require('../../../components/CCComponent');
const RenderTexture = require('../../../assets/CCRenderTexture');
const OUTLINE_SUPPORTED = cc.js.isChildClassOf(LabelOutline, Component);
const getFontFamily = require('../utils').getFontFamily;
const shareLabelInfo = require('../utils').shareLabelInfo;


const FontLetterDefinition = cc.BitmapFont.FontLetterDefinition;
const FontAtlas = cc.BitmapFont.FontAtlas;

const WHITE = cc.Color.WHITE;
const space = 0;
const bleed = 2;
const _invisibleAlpha = (1 / 255).toFixed(3);

function LetterTexture(char, labelInfo) {
    this._texture = null;
    this._labelInfo = labelInfo;
    this._char = char;
    this._hash = null;
    this._data = null;
    this._canvas = null;
    this._context = null;
    this._width = 0;
    this._height = 0;
    this._offsetY = 0;
    this._hash = char.charCodeAt(0) + labelInfo.hash;
}

LetterTexture.prototype = {
    constructor: LetterTexture,

    updateRenderData () {
        this._updateProperties();
        this._updateTexture();
    },
    _updateProperties () {
        this._texture = new cc.Texture2D();
        this._data = Label._canvasPool.get();
        this._canvas = this._data.canvas;
        this._context = this._data.context;
        this._context.font = this._labelInfo.fontDesc;
        let width = textUtils.safeMeasureText(this._context, this._char, this._labelInfo.fontDesc);
        let blank = this._labelInfo.margin * 2 + bleed;
        this._width = parseFloat(width.toFixed(2)) + blank;
        this._height = (1 + textUtils.BASELINE_RATIO) * this._labelInfo.fontSize + blank;
        this._offsetY = - (this._labelInfo.fontSize * textUtils.BASELINE_RATIO) / 2;

        if (this._canvas.width !== this._width) {
            this._canvas.width = this._width;
        }

        if (this._canvas.height !== this._height) {
            this._canvas.height = this._height;
        }

        this._texture.initWithElement(this._canvas);
    },
    _updateTexture () {
        let context = this._context;
        let labelInfo = this._labelInfo,
            width = this._canvas.width,
            height = this._canvas.height;

        const fontSize = this._labelInfo.fontSize;
        let startX = width / 2;
        let startY = height / 2 +  fontSize * textUtils.MIDDLE_RATIO + fontSize * textUtils.BASELINE_OFFSET;
        let color = labelInfo.color;

        // use round for line join to avoid sharp intersect point
        context.lineJoin = 'round';
        context.textAlign = 'center';
        context.clearRect(0, 0, width, height);
        //Add a white background to avoid black edges.
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${_invisibleAlpha})`;
        context.fillRect(0, 0, width, height);
        context.font = labelInfo.fontDesc;

        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
        if (labelInfo.isOutlined && labelInfo.margin > 0) {
            let strokeColor = labelInfo.out || WHITE;
            context.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${strokeColor.a / 255})`;
            context.lineWidth = labelInfo.margin * 2;
            context.strokeText(this._char, startX, startY);
        }
        context.fillText(this._char, startX, startY);

        this._texture.handleLoadedTexture();
    },

    destroy() {
        this._texture._packable = false;
        this._texture.destroy();
        this._texture = null;
        Label._canvasPool.put(this._data);
    },
}

function LetterAtlas(atlases, width, height) {
    let texture = new RenderTexture();
    texture.initWithSize(width, height);
    texture.update();

    this._atlases = atlases;
    this._texture = texture;
    this._id = 0;
    this._tmpId = -1;

    this._x = space;
    this._y = space;
    this._nexty = space;

    this.frees = [];
    this.waitCleans = [];

    this._width = width;
    this._height = height;
}

cc.js.mixin(LetterAtlas.prototype, {
    insertLetterTexture(letterTexture) {
        let texture = letterTexture._texture;
        let width = texture.width, height = texture.height;

        // 先寻找是否有可用的被回收的区域
        if (this.frees.length > 0) {
            let score = Number.MAX_VALUE;
            let areaFit = 0;
            let original = null;
            let originalIndex = 0;

            for (let i = 0; i < this.frees.length; i++) {
                const freeLetter = this.frees[i];
                if (freeLetter._width >= width && freeLetter._height >= height) {
                    areaFit = freeLetter._width * freeLetter._height - width * height;
                    if (areaFit < score) {
                        original = freeLetter;
                        originalIndex = i;
                        score = areaFit;
                    }
                }
            }

            if (original) {
                original._hash = letterTexture._hash;
                original.w = letterTexture._width - bleed;
                original.h = letterTexture._height - bleed;
                original.xAdvance = original.w;
                original.offsetY = letterTexture._offsetY;

                this._texture.drawTextureAt(texture, original.u - bleed / 2, original.v - bleed / 2);

                this._dirty = true;

                this.removeFreeLetter(originalIndex);

                this._atlases._fontDefDictionary.addLetterDefinitions(letterTexture._hash, original);
                return original;
            }
        }

        // 有 bleed 问题，暂时不能复用不同高宽的空间
        // 矫正宽度为三档： <0.75x height <1x height >1x height
        // if (width <= height * 0.75) {
        //     width = height * 0.75;
        // } else if (width <= height) {
        //     width = height;
        // }

        // 没有可用的被回收区域，尝试直接插入
        const oldx = this._x, oldy = this._y, oldnexty = this._nexty;

        if ((this._x + width + space) > this._width) {
            // TODO 跳到下一行之前将这行的剩余区域切成多个正方形并放入 frees，避免浪费
            this._x = space;
            this._y = this._nexty;
        }

        if ((this._y + height) > this._nexty) {
            this._nexty = this._y + height + space;
        }

        if (this._nexty > this._height) {
            this._x = oldx;
            this._y = oldy;
            this._nexty = oldnexty;

            // 回收 waitCleans
            if (this.waitCleans.length > 0) {
                for (const letter of this.waitCleans) {
                    letter._inCleans = false;
                    if (letter.ref === 0) {
                        delete this._atlases._fontDefDictionary._letterDefinitions[letter._hash];
                        this.frees.push(letter);
                    }
                }
                this.waitCleans.length = 0;
                return this.insertLetterTexture(letterTexture);
            } else {
                return null;
            }
        }

        this._texture.drawTextureAt(texture, this._x, this._y);

        this._dirty = true;

        let letter = new FontLetterDefinition();
        letter.u = this._x + bleed / 2;
        letter.v = this._y + bleed / 2;
        letter.texture = this._texture;
        letter.atlas = this;
        letter.ref = 0;
        letter.valid = true;
        letter.w = letterTexture._width - bleed;
        letter.h = letterTexture._height - bleed;
        letter._inCleans = false;
        letter._hash = letterTexture._hash;
        letter._width = width;
        letter._height = height;
        letter.xAdvance = letter.w;
        letter.offsetY = letterTexture._offsetY;

        this._x += width + space;

        this._atlases._fontDefDictionary.addLetterDefinitions(letterTexture._hash, letter);

        return letter
    },

    pushFreeLetter(letter) {
        const i = this.frees.push(letter) - 1;
    },

    removeFreeLetter(index) {
        const temp = this.frees[index];
        const temp2 = this.frees[this.frees.length - 1];
        // temp2.cacheIndex = index;
        // temp.cacheIndex = -1;
        this.frees[index] = temp2;
        this.frees.pop();
    },

    update () {
        if (!this._dirty) return;
        this._texture.update();
        this._dirty = false;
    },

    reset () {
        this._x = space;
        this._y = space;
        this._nexty = space;

        const defs = this._atlases._fontDefDictionary._letterDefinitions;
        for (const key in defs) {
            const def = defs[key];
            if (def.atlas === this) {
                delete defs[key];
            }
        }

        this.frees.length = 0;
        this.waitCleans.length = 0;
    },

    destroy () {
        this.reset();
        const handler = this._atlases.material.getMultiHandler();
        handler.removeTexture(this._texture);
        this._texture.destroy();
        this._texture = null;
    },

});

class LetterAtlases {

    /**
     * 图集数组
     */
    atlases = [];

    /**
     * Char 多纹理材质
     */
    material = null;

    /**
     * Fake MaterialVariant
     */
    fakeMaterial = { material: null };

    /**
     * 抽象图集
     */
    _fontDefDictionary = new FontAtlas(null);

    /**
     * 所有获取过的字符集合
     */
    letterCache = null;

    /**
     * 是否记录所有获取过的字符
     */
    get enableLetterCache() {
        return this._enableLetterCache;
    }
    set enableLetterCache(v) {
        this._enableLetterCache = v;
        this.letterCache = v ? {} : null;
    }
    _enableLetterCache = false;

    constructor() {
        const handler = new cc.sp.MultiHandler();
        this.material = handler.material;
        this.fakeMaterial.material = this.material;

        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLoad, this);
    }

    static init() {
        if (!_shareAtlas) {
            _shareAtlas = new LetterAtlases();
            cc.Label._shareAtlas = _shareAtlas;
        }
    }

    insertLetterTexture(letterTexture) {
        for (const atlas of this.atlases) {
            const letter = atlas.insertLetterTexture(letterTexture);
            if (letter) {
                return letter;
            }
        }

        if (this.atlases.length >= 8) {
            return null;
        } else {
            const atlas = new LetterAtlas(this, _atlasWidth, _atlasHeight);
            const len = this.atlases.push(atlas);
            atlas._id = len - 1;
            const handler = this.material.getMultiHandler();
            handler.setTexture(atlas._id, atlas._texture);
            if (!CC_EDITOR && cc.sp.charAtlasAutoBatchCount >= len) {
                cc.sp.multiBatcher.requsetMaterial(atlas._texture);
            }
            return atlas.insertLetterTexture(letterTexture);
        }
    }


    deleteLetter(letter) {
        letter.ref--;
        if (letter.ref === 0 && !letter._inCleans) {
            letter._inCleans = true;
            letter.atlas.waitCleans.push(letter);
        }
    }


    update() {
        for (const atlas of this.atlases) {
            atlas.update();
        }
    }


    reset() {
        this._fontDefDictionary.clear();

        for (const atlas of this.atlases) {
            atlas.reset();
        }
    }


    destroy() {
        this._fontDefDictionary.clear();

        for (const atlas of this.atlases) {
            atlas.destroy();
        }

        this.atlases.length = 0;
    }


    beforeSceneLoad() {
        if (cc.sp.charAtlasAutoResetBeforeSceneLoad) {
            this.clearAllCache();
        }
    }


    clearAllCache() {
        this.reset();
    }


    getTexture() {
        if (!_emptyTexture) {
            _emptyTexture = new RenderTexture();
            _emptyTexture.initWithSize(_atlasWidth, _atlasHeight);
            _emptyTexture.update();
        }
        return _emptyTexture;
    }


    getLetter(key) {
        return this._fontDefDictionary._letterDefinitions[key];
    }


    getLetterDefinitionForChar(char, labelInfo) {
        let hash = char.charCodeAt(0) + labelInfo.hash;
        let letter = this._fontDefDictionary._letterDefinitions[hash];
        if (!letter) {
            if (this._enableLetterCache) {
                const canvas = Label._canvasPool.get();
                canvas.context.font = labelInfo.fontDesc;
                this.letterCache[hash] = {
                    char,
                    hash: labelInfo.hash,
                    measure: textUtils.safeMeasureText(canvas.context, char, labelInfo.fontDesc),
                    fontDesc: labelInfo.fontDesc,
                    fontSize: labelInfo.fontSize,
                    margin: labelInfo.margin,
                    out: labelInfo.out.toHEX('#rrggbbaa'),
                    color: labelInfo.color.toHEX('#rrggbbaa'),
                    isOutlined: labelInfo.isOutlined,
                };
                Label._canvasPool.put(canvas);
            }
            let temp = new LetterTexture(char, labelInfo);
            temp.updateRenderData();
            letter = this.insertLetterTexture(temp);
            temp.destroy();
        }

        if (letter && _firstTraverse) {
            letter.ref++;
            _assembler._letterRefs.push(letter);
            this.checkMaterialAndUpdateTexId(letter);
        }

        return letter;
    }


    cacheLetter(info) {
        textUtils.applyMeasureCache({ [textUtils.computeHash(info.char, info.fontDesc)]: info.measure });
        shareLabelInfo.hash = info.hash;
        shareLabelInfo.fontDesc = info.fontDesc;
        shareLabelInfo.margin = info.margin;
        shareLabelInfo.out = cc.Color.fromHEX(cc.color(), info.out);
        shareLabelInfo.fontSize = info.fontSize;
        shareLabelInfo.color = cc.Color.fromHEX(cc.color(), info.color);
        shareLabelInfo.isOutlined = info.isOutlined;
        this.getLetterDefinitionForChar(info.char, shareLabelInfo);
    }


    getLetterCache() {
        const arr = [];
        for (const key in this.letterCache) {
            const cache = this.letterCache[key];
            arr.push(cache);
        }
        return arr;
    }


    applyLetterCache(data) {
        for (const cache of data) {
            this.cacheLetter(cache);
        }
    }


    checkMaterialAndUpdateTexId(letter) {
        const atlas = letter.atlas;
        const comp = _assembler._renderComp;

        if (!_usedMaterial) {
            return;
        }

        // 检查是否需要自动切换材质
        if (_needCheckMaterial) {
            _needCheckMaterial = false;
            if (_usedMaterial.material !== _shareAtlas.material) {
                _assembler.checkAndSwitchMaterial(comp, atlas._texture, _usedMaterial);
                _usedMaterial = comp._materials[0];
            }
        }

        // 检查是否需要更新 atlas tmpId，使用内置材质则不检查
        if (_usedMaterial.material !== _shareAtlas.material && atlas._tmpId === -1) {
            const handler = _usedMaterial.material.getMultiHandler();
            if (handler) {
                const index = handler.getIndex(atlas._texture.getImpl());
                if (index !== -1) {
                    atlas._tmpId = index;
                    return;
                }
            }

            // 如果无法在材质中找到 texture，则切换至内置材质
            comp.setMaterial(0, _shareAtlas.material);
            _usedMaterial = _shareAtlas.fakeMaterial;
        }
    }

}

function computeHash (labelInfo) {
    let hashData = '|';
    let color = labelInfo.color.toHEX('#rrggbbaa');
    let out = '';
    if (labelInfo.isOutlined && labelInfo.margin > 0) {
        out = out + labelInfo.margin + labelInfo.out.toHEX('#rrggbbaa');
    }

    return hashData + labelInfo.fontSize + labelInfo.fontFamily + color + out;
}

let _shareAtlas = null;

let _atlasWidth = 2048;
let _atlasHeight = 2048;
let _isBold = false;
let _usedMaterial = null;
let _needCheckMaterial = false;
let _firstTraverse = false;
let _assembler = null;
let _emptyTexture = null;

export default class LetterFontAssembler extends WebglBmfontAssembler {
    _letterRefs = [];

    initData() {
        let data = this._renderData;
        data.createFlexData(0, this.verticesCount, this.indicesCount, this.getVfmt());
    }

    getVfmt() {
        return vfmtPosUvColorTexId;
    }

    getBuffer() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }

    _getAssemblerData () {
        if (!_shareAtlas) {
            _shareAtlas = new LetterAtlases();
            cc.Label._shareAtlas = _shareAtlas;
        }

        return _shareAtlas.getTexture();
    }

    _updateFontFamily (comp) {
        shareLabelInfo.fontAtlas = _shareAtlas;
        shareLabelInfo.fontFamily = getFontFamily(comp);

        // outline
        let outline = OUTLINE_SUPPORTED && comp.getComponent(LabelOutline);
        if (outline && outline.enabled) {
            shareLabelInfo.isOutlined = true;
            shareLabelInfo.margin = outline.width;
            shareLabelInfo.out = outline.color.clone();
            shareLabelInfo.out.a = outline.color.a * comp.node.color.a / 255.0;
        }
        else {
            shareLabelInfo.isOutlined = false;
            shareLabelInfo.margin = 0;
        }
    }

    _updateLabelInfo (comp) {
        shareLabelInfo.fontDesc = this._getFontDesc();
        shareLabelInfo.color = comp.node.color;
        shareLabelInfo.hash = computeHash(shareLabelInfo);
    }

    _getFontDesc () {
        let fontDesc = shareLabelInfo.fontSize.toString() + 'px ';
        fontDesc = fontDesc + shareLabelInfo.fontFamily;
        if (_isBold) {
            fontDesc = "bold " + fontDesc;
        }

        return fontDesc;
    }

    _computeHorizontalKerningForText () {
        this._clearHorizontalKerning();
    }

    _determineRect (tempRect) {
        return false;
    }

    _aftUpdateRenderData(comp) {
        // 还原 tex id 与当前使用材质
        _assembler = this;
        _usedMaterial = _assembler._renderComp._materials[0];
        _needCheckMaterial = true;
        _firstTraverse = true;
        for (const atlas of _shareAtlas.atlases) {
            atlas._tmpId = -1;
        }

        // 还原 letterRef
        this._recycleLetterRef();

        super._aftUpdateRenderData(comp);

        _usedMaterial = null;
        _assembler = null;
    }

    _finishMultilineTextWrap() {
        _firstTraverse = false;
    }

    _recycleLetterRef() {
        for (const letter of this._letterRefs) {
            _shareAtlas.deleteLetter(letter);
        }
        this._letterRefs.length = 0;
    }

    _resetAssemblerData(assemblerData) {
        if (this._letterRefs.length !== 0) {
            this._recycleLetterRef();
        }
    }

    appendVerts(comp, offset, l, r, b, t, letter) {
        super.appendVerts(comp, offset, l, r, b, t, letter);

        // update texId
        const renderData = this._renderData;
        const verts = renderData.vDatas[0];
        const floatsPerVert = this.floatsPerVert;
        let texIdOffset = offset + this.texIdOffset;
        const id = !_usedMaterial ? 0 : (_usedMaterial.material !== _shareAtlas.material ? letter.atlas._tmpId : letter.atlas._id);

        verts[texIdOffset] = id;
        texIdOffset += floatsPerVert;
        verts[texIdOffset] = id;
        texIdOffset += floatsPerVert;
        verts[texIdOffset] = id;
        texIdOffset += floatsPerVert;
        verts[texIdOffset] = id;
    }

}

LetterFontAssembler.prototype.floatsPerVert = 6;
LetterFontAssembler.prototype.texIdOffset = 5;
LetterFontAssembler.prototype.isMulti = true;

Label.LetterAtlases = LetterAtlases;
