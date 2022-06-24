/**
 * 多纹理 Material 管理类
 */
export class MultiHandler {

    /**
     * 材质
     */
    material: any;

    /**
     * Texture 数组
     *
     * 注意：不是 cc.Texture2D
     */
    protected textures: any[] = [];

    /**
     * 有空槽（缓存值，并不是完全正确，只是为了降低当材质没有空槽时避免数组遍历的性能消耗）
     */
    protected hasEmptySlot: boolean = false;


    constructor(material?) {
        if (material) {
            this.material = material;
        } else {
            this.material = (cc.Material as any).create(cc.sp.multi2dSpriteEffectAsset);
            this.material.name = "multi-2d-sprite";
            this.material.define('USE_TEXTURE', true);
            this.material.define('USE_MULTI_TEXTURE', true);
        }
        this.material._multiHandler = this;
        this.syncTextures();
    }


    /**
     * 同步 Material 的纹理插槽数据
     *
     * 当自行设置插槽可调用此函数同步数组
     */
    syncTextures() {
        const effect = this.material['effect'];
        const properties = effect.passes[0]._properties;

        this.textures[0] = properties.texture.value;
        this.textures[1] = properties.texture2.value;
        this.textures[2] = properties.texture3.value;
        this.textures[3] = properties.texture4.value;
        this.textures[4] = properties.texture5.value;
        this.textures[5] = properties.texture6.value;
        this.textures[6] = properties.texture7.value;
        this.textures[7] = properties.texture8.value;

        // refresh has empty slot state
        this.hasEmptySlot = true;
        this.getEmptyIndex();
    }


    /**
     * 设置纹理插槽（提供 cc.Texture2D）
     */
    setTexture(index: number, texture: any) {
        this.textures[index] = texture ? texture.getImpl() : null;
        this.material.setProperty(cc.sp.propertyIndex2Name(index), texture);
        if (texture == null) this.hasEmptySlot = true;
    }


    /**
     * 移除指定纹理
     *
     * 注意：不是 cc.Texture2D
     */
    removeTexture(texture: any) {
        const index = this.getIndex(texture);
        if (index !== -1) {
            this.setTexture(index, null);
        }
    }


    /**
     * 纹理是否在插槽中
     *
     * 注意：不是 cc.Texture2D
     */
    hasTexture(texture: any) {
        return this.textures.indexOf(texture) !== -1;
    }


    /**
     * 获取纹理在插槽中的 Index，没有返回 -1
     *
     * 注意：不是 cc.Texture2D
     */
    getIndex(texture: any) {
        return this.textures.indexOf(texture);
    }


    /**
     * 获取指定 index 中的纹理
     *
     * 注意：不是 cc.Texture2D
     */
    getTexture(index: number) {
        return this.textures[index];
    }


    /**
     * 获取空插槽 Index，没有返回 -1
     */
    getEmptyIndex() {
        if (!this.hasEmptySlot) return -1;
        const index = this.textures.indexOf(null);
        if (index !== -1) {
            return index;
        } else {
            this.hasEmptySlot = false;
            return -1;
        }
    }


    /**
     * 自动设置纹理到空插槽，返回插槽下标，失败返回 -1（提供 cc.Texture2D）
     */
    autoSetTexture(texture: any) {
        const index = this.getEmptyIndex();
        if (index === -1) {
            return -1;
        }

        this.setTexture(index, texture);
        return index;
    }

}


cc.sp.MultiHandler = MultiHandler;
