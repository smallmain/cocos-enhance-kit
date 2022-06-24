import { vfmtPosUvColor } from './webgl/vertex-format';
import assemblerPool from './assembler-pool';
import dynamicAtlasManager from './utils/dynamic-atlas/manager';

export default class Assembler {
    constructor () {
        this._extendNative && this._extendNative();
    }
    init (renderComp) {
        this._renderComp = renderComp;
    }
    
    updateRenderData (comp) {
    }

    updateRenderDataForSwitchMaterial(comp) {

    }

    fillBuffers (comp, renderer) {
    }
    
    getVfmt () {
        return vfmtPosUvColor;
    }

    packDynamicAtlasAndCheckMaterial(comp, frame) {
        if (CC_TEST) return false;

            if (!frame._original && dynamicAtlasManager && frame._texture.packable && frame._texture.loaded) {
                let packedFrame = dynamicAtlasManager.insertSpriteFrame(frame);
                if (packedFrame) {
                    frame._setDynamicAtlasFrame(packedFrame);
                }
            }

        const material = comp._materials[0];
        if (!material) return false;

        // 自动切换材质
        if (this.checkAndSwitchMaterial(comp, frame._texture, material)) {
            return true;
        }

        if (material.material.isMultiSupport()) {
            comp._texIdDirty = true;
        } else {
            if (material.getProperty('texture') !== frame._texture._texture) {
                // texture was packed to dynamic atlas, should update uvs
                comp._vertsDirty = true;
                comp._updateMaterial();
            }
        }

        return false;
    }

    checkAndSwitchMaterial(comp, texture, material) {
        const autoSwitchMaterial = comp.autoSwitchMaterial;
        if ((cc.sp.autoSwitchMaterial && autoSwitchMaterial === 0) || autoSwitchMaterial === 1) {
            if (texture._multiMaterial) {
                if (material.material !== texture._multiMaterial) {
                    // 避免在 Native 平台时再次进入渲染待刷新队列
                    if (CC_JSB) comp.node._inJsbDirtyList = true;
                    comp.setMaterial(0, texture._multiMaterial);
                    if (CC_JSB) comp.node._inJsbDirtyList = false;
                    // setMaterial 中会置 comp._texIdDirty = true;
                    if (!this.isMulti) {
                        comp._assembler.updateRenderDataForSwitchMaterial(comp);
                        return true;
                    }
                }
            }
        }
    }

}


Assembler.register = function (renderCompCtor, assembler) {
    renderCompCtor.__assembler__ = assembler;
};

Assembler.init = function (renderComp) {
    let renderCompCtor = renderComp.constructor;
    let assemblerCtor =  renderCompCtor.__assembler__;
    while (!assemblerCtor) {
        renderCompCtor = renderCompCtor.$super;
        if (!renderCompCtor) {
            cc.warn(`Can not find assembler for render component : [${cc.js.getClassName(renderComp)}]`);
            return;
        }
        assemblerCtor =  renderCompCtor.__assembler__;
    }
    if (assemblerCtor.getConstructor) {
        assemblerCtor = assemblerCtor.getConstructor(renderComp);
    }
    
    if (!renderComp._assembler || renderComp._assembler.constructor !== assemblerCtor) {
        let assembler = assemblerPool.get(assemblerCtor);
        assembler.init(renderComp);
        renderComp._assembler = assembler;
    }
};

cc.Assembler = Assembler;
