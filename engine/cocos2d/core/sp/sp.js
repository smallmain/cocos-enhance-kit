cc.sp = {

    /**
     * 是否初始化完成
     */
    inited: false,

    /**
     * 版本号
     */
    version: "1.0.0",

    /**
     * 最大纹理插槽数量
     *
     * 固定为 8
     */
    MAX_MULTITEXTURE_NUM: -1,

    /**
     * 渲染组件是否默认自动切换至贴图关联的材质
     */
    autoSwitchMaterial: true,

    /**
     * 渲染组件是否默认参与动态合图
     */
    allowDynamicAtlas: true,

    /**
     * Label 组件是否默认启用渲染时进行缩放以适配高 DPI 屏幕
     */
    enableLabelRetina: true,

    /**
     * Label 组件渲染时进行缩放的缩放比例
     */
    labelRetinaScale: 1,

    /**
     * Char 图集会进行自动多纹理合批的数量
     */
    charAtlasAutoBatchCount: 1,

    /**
     * Char 图集是否在场景切换时清空
     */
    charAtlasAutoResetBeforeSceneLoad: true,

    /**
     * 内置的多纹理合批 Effect Asset
     */
    multi2dSpriteEffectAsset: null,

    /**
     * property index to name map
     */
    i2nMap: ['texture'],

    /**
     * property name to index map
     */
    n2iMap: { texture: 0 },

    /**
     * property index to name
     */
    propertyIndex2Name(index) {
        return this.i2nMap[index];
    },

    /**
     * property name to index
     */
    propertyName2Index(name) {
        return this.n2iMap[name];
    },

};

// 初始化
for (let i = 1; i < 8; i++) {
    const name = "texture" + (i + 1);
    cc.sp.i2nMap[i] = name;
    cc.sp.n2iMap[name] = i;
}
