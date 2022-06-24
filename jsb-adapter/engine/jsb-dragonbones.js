import { RSA_NO_PADDING } from "constants";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
const cacheManager = require('./jsb-cache-manager');

(function(){
    if (window.dragonBones === undefined || window.middleware === undefined) return;
    if (dragonBones.DragonBonesAtlasAsset === undefined) return;

    // dragonbones global time scale.
    Object.defineProperty(dragonBones, 'timeScale', {
        get () {
            return this._timeScale;
        },
        set (value) {
            this._timeScale = value;
            let factory = this.CCFactory.getInstance();
            factory.setTimeScale(value);
        },
        configurable: true,
    });

    jsb.generateGetSet(dragonBones);
    let _slotColor = cc.color(0, 0, 255, 255);
    let _boneColor = cc.color(255, 0, 0, 255);
    let _originColor = cc.color(0, 255, 0, 255);

    ////////////////////////////////////////////////////////////
    // override dragonBones library by native dragonBones
    ////////////////////////////////////////////////////////////
    //--------------------
    // adapt event name
    //--------------------
    dragonBones.EventObject.START = "start";
    dragonBones.EventObject.LOOP_COMPLETE = "loopComplete";
    dragonBones.EventObject.COMPLETE = "complete";
    dragonBones.EventObject.FADE_IN = "fadeIn";
    dragonBones.EventObject.FADE_IN_COMPLETE = "fadeInComplete";
    dragonBones.EventObject.FADE_OUT = "fadeOut";
    dragonBones.EventObject.FADE_OUT_COMPLETE = "fadeOutComplete";
    dragonBones.EventObject.FRAME_EVENT = "frameEvent";
    dragonBones.EventObject.SOUND_EVENT = "soundEvent";

    dragonBones.DragonBones = {
        ANGLE_TO_RADIAN : Math.PI / 180,
        RADIAN_TO_ANGLE : 180 / Math.PI
    };

    //-------------------
    // native factory
    //-------------------

    let factoryProto = dragonBones.CCFactory.prototype;
    factoryProto.createArmatureNode = function (comp, armatureName, node) {
        node = node || new cc.Node();
        let display = node.getComponent(dragonBones.ArmatureDisplay);
        if (!display) {
            display = node.addComponent(dragonBones.ArmatureDisplay);
        }

        node.name = armatureName;
        
        display._armatureName = armatureName;
        display._N$dragonAsset = comp.dragonAsset;
        display._N$dragonAtlasAsset = comp.dragonAtlasAsset;
        display._init();

        return display;
    };

    let _replaceSkin = factoryProto.replaceSkin;
    factoryProto.replaceSkin = function (armatrue, skinData, isOverride, exclude) {
        if (isOverride == undefined) isOverride = false;
        exclude = exclude || [];
        _replaceSkin.call(this, armatrue, skinData, isOverride, exclude);
    };

    let _changeSkin = factoryProto.changeSkin;
    factoryProto.changeSkin = function (armatrue, skinData, exclude) {
        _changeSkin.call(this, armatrue, skinData, exclude);
    };

    //-------------------
    // native animation state
    //-------------------
    let animationStateProto = dragonBones.AnimationState.prototype;
    let _isPlaying = animationStateProto.isPlaying;
    Object.defineProperty(animationStateProto, 'isPlaying', {
        get () {
            return _isPlaying.call(this);
        }
    });

    //-------------------
    // native armature
    //-------------------
    let armatureProto = dragonBones.Armature.prototype;

    armatureProto.addEventListener = function (eventType, listener, target) {
        if (!this.__persistentDisplay__) {
            this.__persistentDisplay__ = this.getDisplay();
        }
        this.__persistentDisplay__.on(eventType, listener, target);
    };

    armatureProto.removeEventListener = function (eventType, listener, target) {
        if (!this.__persistentDisplay__) {
            this.__persistentDisplay__ = this.getDisplay();
        }
        this.__persistentDisplay__.off(eventType, listener, target);
    };

    //--------------------------
    // native CCArmatureDisplay
    //--------------------------
    let nativeArmatureDisplayProto = dragonBones.CCArmatureDisplay.prototype;

    Object.defineProperty(nativeArmatureDisplayProto,"node",{
        get : function () {
            return this;
        }
    });

    nativeArmatureDisplayProto.getRootNode = function () {
        let rootDisplay = this.getRootDisplay();
        return rootDisplay && rootDisplay._ccNode;
    };

    nativeArmatureDisplayProto.convertToWorldSpace = function (point) {
        let newPos = this.convertToRootSpace(point);
        newPos = cc.v2(newPos.x, newPos.y);
        let ccNode = this.getRootNode();
        if (!ccNode) return newPos;
        let finalPos = ccNode.convertToWorldSpaceAR(newPos);
        return finalPos;
    };

    nativeArmatureDisplayProto.initEvent = function () {
        if (this._eventTarget) {
            return;
        }
        this._eventTarget = new cc.EventTarget();
        this.setDBEventCallback(function(eventObject) {
            this._eventTarget.emit(eventObject.type, eventObject);
        });
    };

    nativeArmatureDisplayProto.on = function (type, listener, target) {
        this.initEvent();
        this._eventTarget.on(type, listener, target);
        this.addDBEventListener(type, listener);
    };

    nativeArmatureDisplayProto.off = function (type, listener, target) {
        this.initEvent();
        this._eventTarget.off(type, listener, target);
        this.removeDBEventListener(type, listener);
    };

    nativeArmatureDisplayProto.once = function (type, listener, target) {
        this.initEvent();
        this._eventTarget.once(type, listener, target);
        this.addDBEventListener(type, listener);
    };

    ////////////////////////////////////////////////////////////
    // override DragonBonesAtlasAsset
    ////////////////////////////////////////////////////////////
    let dbAtlas = dragonBones.DragonBonesAtlasAsset.prototype;
    let _gTextureIdx = 1;
    let _textureKeyMap = {};
    let _textureMap = new WeakMap();
    let _textureIdx2Name = {};

    dbAtlas.removeRecordTexture = function (texture) {
        if (!texture) return;
        delete _textureIdx2Name[texture.url];
        let index = texture.__textureIndex__;
        if (index) {
            let texKey = _textureKeyMap[index];
            if (texKey && _textureMap.has(texKey)) {
                _textureMap.delete(texKey);
                delete _textureKeyMap[index];
            }
        }
    };

    dbAtlas.recordTexture = function () {
        if (this._texture && this._oldTexture !== this._texture) {
            this.removeRecordTexture(this._oldTexture);
            let texKey = _textureKeyMap[_gTextureIdx] = {key:_gTextureIdx};
            _textureMap.set(texKey, this._texture);
            this._oldTexture = this._texture;
            this._texture.__textureIndex__ = _gTextureIdx;
            _gTextureIdx++;
        }
    };

    dbAtlas.getTextureByIndex = function (textureIdx) {
        let texKey = _textureKeyMap[textureIdx];
        if (!texKey) return;
        return _textureMap.get(texKey);
    };

    dbAtlas.updateTextureAtlasData = function (factory) {
        let url = this._texture.url;
        let preAtlasInfo = _textureIdx2Name[url];
        let index;

        // If the texture has store the atlas info before,then get native atlas object,and 
        // update script texture map.
        if (preAtlasInfo) {
            index = preAtlasInfo.index;
            this._textureAtlasData = factory.getTextureAtlasDataByIndex(preAtlasInfo.name,index);
            let texKey = _textureKeyMap[preAtlasInfo.index];
            _textureMap.set(texKey, this._texture);
            this._texture.__textureIndex__ = index;
            // If script has store the atlas info,but native has no atlas object,then
            // still new native texture2d object,but no call recordTexture to increase
            // textureIndex.
            if (this._textureAtlasData) {
                return;
            }
        } else {
            this.recordTexture();
        }

        index = this._texture.__textureIndex__;
        this.jsbTexture = new middleware.Texture2D();
        this.jsbTexture.setRealTextureIndex(index);
        this.jsbTexture.setPixelsWide(this._texture.width);
        this.jsbTexture.setPixelsHigh(this._texture.height);
        this._textureAtlasData = factory.parseTextureAtlasData(this.atlasJson, this.jsbTexture, this._uuid);
        this.jsbTexture.setNativeTexture(this._texture.getImpl());

        _textureIdx2Name[url] = {name:this._textureAtlasData.name, index:index};
    };

    dbAtlas.init = function (factory) {
        this._factory = factory;

        // If create by manual, uuid is empty.
        if (!this._uuid) {
            let atlasJsonObj = JSON.parse(this.atlasJson);
            this._uuid = atlasJsonObj.name;
        }

        if (this._textureAtlasData) {
            factory.addTextureAtlasData(this._textureAtlasData, this._uuid);
        }
        else {
            this.updateTextureAtlasData(factory);
        }
    };

    dbAtlas._clear = function (dontRecordTexture) {
        if (this._factory) {
            this._factory.removeTextureAtlasData(this._uuid, true);
            this._factory.removeDragonBonesDataByUUID(this._uuid, true);
        }
        this._textureAtlasData = null;
        if (!dontRecordTexture) {
            this.recordTexture();
        }
    };

    dbAtlas.destroy = function () {
        this.removeRecordTexture(this._texture);
        this._clear(true);
        cc.Asset.prototype.destroy.call(this);
    };

    ////////////////////////////////////////////////////////////
    // override DragonBonesAsset
    ////////////////////////////////////////////////////////////
    let dbAsset = dragonBones.DragonBonesAsset.prototype;

    dbAsset.init = function (factory, atlasUUID) {
        this._factory = factory;

        // If create by manual, uuid is empty.
        // Only support json format, if remote load dbbin, must set uuid by manual.
        if (!this._uuid && this.dragonBonesJson) {
            let rawData = JSON.parse(this.dragonBonesJson);
            this._uuid = rawData.name;
        }

        let armatureKey = this._uuid + "#" + atlasUUID;
        let dragonBonesData = this._factory.getDragonBonesData(armatureKey);
        if (dragonBonesData) return armatureKey;

        let filePath = null;
        if (this.dragonBonesJson) {
            filePath = this.dragonBonesJson;
        } else {
            filePath = cacheManager.getCache(this.nativeUrl) || this.nativeUrl;
        }
        this._factory.parseDragonBonesDataByPath(filePath, armatureKey);
        return armatureKey;
    };

    let armatureCacheMgr = dragonBones.ArmatureCacheMgr.getInstance();
    dragonBones.armatureCacheMgr = armatureCacheMgr;
    dbAsset._clear = function () {
        if (this._factory) {
            this._factory.removeDragonBonesDataByUUID(this._uuid, true);
        }
        armatureCacheMgr.removeArmatureCache(this._uuid);
    };

    ////////////////////////////////////////////////////////////
    // adapt attach util
    ////////////////////////////////////////////////////////////

    let attachUtilProto = dragonBones.AttachUtil.prototype;

    let _attachUtilInit = attachUtilProto.init;
    attachUtilProto.init = function (armatureDisplay) {
        _attachUtilInit.call(this, armatureDisplay);
        this._nativeDisplay = armatureDisplay._nativeDisplay;
        this._attachUtilNative = null;
    };

    let _generateAllAttachedNodes = attachUtilProto.generateAllAttachedNodes;
    attachUtilProto.generateAllAttachedNodes = function () {
        let res = _generateAllAttachedNodes.call(this);
        this._associateAttachedNode();
        return res;
    };

    let _generateAttachedNodes = attachUtilProto.generateAttachedNodes;
    attachUtilProto.generateAttachedNodes = function (boneName) {
        let res = _generateAttachedNodes.call(this, boneName);
        this._associateAttachedNode();
        return res;
    };

    let _associateAttachedNode = attachUtilProto._associateAttachedNode;
    attachUtilProto._associateAttachedNode = function () {
        if (!this._inited) return;

        let rootNode = this._armatureNode.getChildByName('ATTACHED_NODE_TREE');
        if (!rootNode || !rootNode.isValid) return;

        // associate js
        _associateAttachedNode.call(this);

        // associate native
        if (!this._attachUtilNative) {
            if (this._armatureDisplay.isAnimationCached()) {
                this._attachUtilNative = new dragonBones.CacheModeAttachUtil();
            } else {
                this._attachUtilNative = new dragonBones.RealTimeAttachUtil();
            }
            this._nativeDisplay.setAttachUtil(this._attachUtilNative);
        }
        this._attachUtilNative.associateAttachedNode(this._armature, this._armatureNode._proxy);
    };

    ////////////////////////////////////////////////////////////
    // override ArmatureDisplay
    ////////////////////////////////////////////////////////////
    dragonBones.ArmatureDisplay._assembler = null;
    let armatureDisplayProto = dragonBones.ArmatureDisplay.prototype;
    let renderCompProto = cc.RenderComponent.prototype;
    const AnimationCacheMode = dragonBones.ArmatureDisplay.AnimationCacheMode;

    Object.defineProperty(armatureDisplayProto, 'armatureName', {
        get () {
            return this._armatureName;
        },
        set (value) {
            this._armatureName = value;
            let animNames = this.getAnimationNames(this._armatureName);

            if (!this.animationName || animNames.indexOf(this.animationName) < 0) {
                this.animationName = '';
            }

            var oldArmature = this._armature;
            if (this._armature) {
                if (!this.isAnimationCached()) {
                    this._factory.remove(this._armature);
                }
                this._armature = null;
            }
            this._nativeDisplay = null;
            
            this._refresh();
            
            if (oldArmature && oldArmature != this._armature) {
                oldArmature.dispose();
            }
            
            if (this._armature && !this.isAnimationCached()) {
                this._factory.add(this._armature);
            }
        },
        visible: false
    });

    Object.defineProperty(armatureDisplayProto, "premultipliedAlpha", {
        get () {
            if (this._premultipliedAlpha === undefined){
                return false;
            }
            return this._premultipliedAlpha;
        },
        set (value) {
            this._premultipliedAlpha = value;
            if (this._nativeDisplay) {
                this._nativeDisplay.setOpacityModifyRGB(this._premultipliedAlpha);
            }
        }
    });

    let _initDebugDraw = armatureDisplayProto._initDebugDraw;
    armatureDisplayProto._initDebugDraw = function () {
        _initDebugDraw.call(this);
        if (this._armature && !this.isAnimationCached()) {
            this._nativeDisplay.setDebugBonesEnabled(this.debugBones);
        }
    };

    let _updateBatch = armatureDisplayProto._updateBatch;
    armatureDisplayProto._updateBatch = function () {
        _updateBatch.call(this);
        if (this._nativeDisplay) {
            this._nativeDisplay.setBatchEnabled(this.enableBatch);
        }
        this._assembler && this._assembler.clearEffect();
    };

    armatureDisplayProto._clearRenderData = function () {
        this._nativeDisplay = null;
    };

    armatureDisplayProto._resetAssembler = function () {
        this._assembler = new renderer.CustomAssembler();
        this.node._proxy.setAssembler(this._assembler);
    };

    let _updateMaterial = armatureDisplayProto._updateMaterial;
    let _materialHash2IDMap = {};
    let _materialId = 1;
    armatureDisplayProto._updateMaterial = function() {
        _updateMaterial.call(this);
        this._assembler && this._assembler.clearEffect();
        let baseMaterial = this.getMaterial(0);
        if (this._nativeDisplay && baseMaterial) {
            let originHash = baseMaterial.effect.getHash();
            let id = _materialHash2IDMap[originHash] || _materialId++;
            _materialHash2IDMap[originHash] = id;
            baseMaterial.effect.updateHash(id);
            let nativeEffect = baseMaterial.effect._nativeObj;
            this._nativeDisplay.setEffect(nativeEffect);
        }
    };

    armatureDisplayProto._buildArmature = function () {
        if (!this.dragonAsset || !this.dragonAtlasAsset || !this.armatureName) {
            this._clearRenderData();
            return;
        }

        if (this._nativeDisplay) {
            this._nativeDisplay.dispose();
            this._nativeDisplay._comp = null;
            this._nativeDisplay = null;
        }

        let atlasUUID = this.dragonAtlasAsset._uuid;
        this._armatureKey = this.dragonAsset.init(this._factory, atlasUUID);

        if (this.isAnimationCached()) {
            this._nativeDisplay = new dragonBones.CCArmatureCacheDisplay(this.armatureName, this._armatureKey, atlasUUID, this._cacheMode == AnimationCacheMode.SHARED_CACHE);
            this._armature = this._nativeDisplay.armature();
        } else {
            this._nativeDisplay = this._factory.buildArmatureDisplay(this.armatureName, this._armatureKey, "", atlasUUID);
            if (!this._nativeDisplay) {
                this._clearRenderData();
                return;
            }
            
            this._nativeDisplay.setDebugBonesEnabled(this.debugBones);
            this._armature = this._nativeDisplay.armature();
            this._armature.animation.timeScale = this.timeScale;
            this._factory.add(this._armature);
        }

        // add all event into native display
        let callbackTable = this._eventTarget._callbackTable;
        // just use to adapt to native api
        let emptyHandle = function () {};
        for (let key in callbackTable) {
            let list = callbackTable[key];
            if (!list || !list.callbackInfos || !list.callbackInfos.length) continue;
            if (this.isAnimationCached()) {
                this._nativeDisplay.addDBEventListener(key);
            } else {
                this._nativeDisplay.addDBEventListener(key, emptyHandle);
            }
        }

        this._preCacheMode = this._cacheMode;
        this._nativeDisplay._ccNode = this.node;
        this._nativeDisplay._comp = this;
        this._nativeDisplay._eventTarget = this._eventTarget;

        this._nativeDisplay.bindNodeProxy(this.node._proxy);
        this._nativeDisplay.setOpacityModifyRGB(this.premultipliedAlpha);
        this._nativeDisplay.setBatchEnabled(this.enableBatch);
        this._nativeDisplay.setColor(this.node.color);
        
        this._nativeDisplay.setDBEventCallback(function(eventObject) {
            this._eventTarget.emit(eventObject.type, eventObject);
        });

        this.attachUtil.init(this);
        this.attachUtil._associateAttachedNode();

        if (this.animationName) {
            this.playAnimation(this.animationName, this.playTimes);
        }

        this._updateMaterial();
        this.markForRender(true);
    };

    armatureDisplayProto._updateColor = function () {
        if (this._nativeDisplay) {
            this._nativeDisplay.setColor(this.node.color);
        }
    };

    armatureDisplayProto.playAnimation = function (animName, playTimes) {
        this.playTimes = (playTimes === undefined) ? -1 : playTimes;
        this.animationName = animName;

        if (this._nativeDisplay) {
            if (this.isAnimationCached()) {
                return this._nativeDisplay.playAnimation(animName, this.playTimes);
            } else {
                if (this._armature) {
                    return this._armature.animation.play(animName, this.playTimes);
                }
            }
        }
        return null;
    };

    armatureDisplayProto.updateAnimationCache = function (animName) {
        if (!this.isAnimationCached()) return;
        if (this._nativeDisplay) {
            if (animName) {
                this._nativeDisplay.updateAnimationCache(animName);
            } else {
                this._nativeDisplay.updateAllAnimationCache();
            }
        }
    };

    armatureDisplayProto.invalidAnimationCache = function () {
        if (!this.isAnimationCached()) return;
        if (this._nativeDisplay) {
            this._nativeDisplay.updateAllAnimationCache();
        }
    };

    armatureDisplayProto.onEnable = function () {
        renderCompProto.onEnable.call(this);
        if (this._armature && !this.isAnimationCached()) {
            this._factory.add(this._armature);
        }
    };

    armatureDisplayProto.onDisable = function () {
        renderCompProto.onDisable.call(this);
        if (this._armature && !this.isAnimationCached()) {
            this._factory.remove(this._armature);
        }
    };

    let _onLoad = armatureDisplayProto.onLoad;
    armatureDisplayProto.onLoad = function () {
        if (_onLoad) {
            _onLoad.call(this);
        }
    };

    armatureDisplayProto.once = function (eventType, listener, target) {
        if (this._nativeDisplay) {
            if (this.isAnimationCached()) {
                this._nativeDisplay.addDBEventListener(eventType);
            } else {
                this._nativeDisplay.addDBEventListener(eventType, listener);
            }
        }
        this._eventTarget.once(eventType, listener, target);
    };

    armatureDisplayProto.addEventListener = function (eventType, listener, target) {
        if (this._nativeDisplay) {
            if (this.isAnimationCached()) {
                this._nativeDisplay.addDBEventListener(eventType);
            } else {
                this._nativeDisplay.addDBEventListener(eventType, listener);
            }
            
        }
        this._eventTarget.on(eventType, listener, target);
    };

    armatureDisplayProto.removeEventListener = function (eventType, listener, target) {
        if (this._nativeDisplay) {
            if (this.isAnimationCached()) {
                this._nativeDisplay.removeDBEventListener(eventType);
            } else {
                this._nativeDisplay.removeDBEventListener(eventType, listener);
            }
        }
        this._eventTarget.off(eventType, listener, target);
    };

    let _onDestroy = armatureDisplayProto.onDestroy;
    armatureDisplayProto.onDestroy = function(){
        _onDestroy.call(this);
        if (this._nativeDisplay) {
            this._nativeDisplay.dispose();
            this._nativeDisplay._comp = null;
            this._nativeDisplay = null;
        }
        this._materialCache = null;
    };
    
    armatureDisplayProto.update = function() {
        let nativeDisplay = this._nativeDisplay;
        if (!nativeDisplay) return;

        let node = this.node;
        if (!node) return;

        if (!this.isAnimationCached() && this._debugDraw && this.debugBones) {

            let nativeDisplay = this._nativeDisplay;
            this._debugData = this._debugData || nativeDisplay.getDebugData();
            if (!this._debugData) return;

            let graphics = this._debugDraw;
            graphics.clear();

            let debugData = this._debugData;
            let debugIdx = 0;

            graphics.lineWidth = 5;
            graphics.strokeColor = _boneColor;
            graphics.fillColor = _slotColor; // Root bone color is same as slot color.

            let debugBonesLen = debugData[debugIdx++];
            for (let i = 0; i < debugBonesLen; i += 4) {
                let bx = debugData[debugIdx++];
                let by = debugData[debugIdx++];
                let x = debugData[debugIdx++];
                let y = debugData[debugIdx++];

                // Bone lengths.
                graphics.moveTo(bx, by);
                graphics.lineTo(x, y);
                graphics.stroke();

                // Bone origins.
                graphics.circle(bx, by, Math.PI * 2);
                graphics.fill();
                if (i === 0) {
                    graphics.fillColor = _originColor;
                }
            }
            
        }
    };
})();
