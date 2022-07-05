declare module cc {

    /**
     * Cocos Creator Service Pack 命名空间
     */
    module sp {

        /**
         * 是否初始化完成
         */
        const inited: boolean,

        /**
         * 版本号
         */
        const version: string,

        /**
         * 最大纹理插槽数量
         * 
         * 固定为 8
         */
        const MAX_MULTITEXTURE_NUM: number;

        /**
         * 渲染组件是否默认自动切换至贴图关联的多纹理材质
         */
        let autoSwitchMaterial: boolean;

        /**
         * 渲染组件是否默认参与动态合图
         */
        let allowDynamicAtlas: boolean;

        /**
         * Label 组件是否默认启用渲染时进行缩放以适配高 DPI 屏幕
         */
        let enableLabelRetina: boolean;

        /**
         * Label 组件渲染时进行缩放的缩放比例
         */
        let labelRetinaScale: number;

        /**
         * Char 图集会进行自动多纹理合批的数量
         */
        let charAtlasAutoBatchCount: number;

        /**
         * Char 图集是否在场景切换时清空
         */
        let charAtlasAutoResetBeforeSceneLoad: boolean;

        /**
         * 内置的多纹理合批 Effect Asset
         */
        const multi2dSpriteEffectAsset: cc.EffectAsset;

        /**
         * property index to name
         */
        function propertyIndex2Name(index: number): string;

        /**
         * property name to index
         */
        function propertyName2Index(name: string): number;

        /**
         * 多纹理 Material 管理类
         */
        class MultiHandler {

            /**
             * 材质
             */
            material: cc.Material;

            /**
             * Texture 数组
             *
             * 注意：不是 cc.Texture2D
             */
            protected textures: any[];

            /**
             * 有空槽（缓存值，并不是完全正确，只是为了降低当材质没有空槽时避免数组遍历的性能消耗）
             */
            protected hasEmptySlot: boolean;


            constructor(material?: cc.Material);


            /**
             * 同步 Material 的纹理插槽数据
             *
             * 当自行设置插槽可调用此函数同步 Material 上的插槽数据至 textures 数组
             */
            syncTextures(): void;


            /**
             * 设置纹理插槽（提供 cc.Texture2D）
             */
            setTexture(index: number, texture: cc.Texture2D): void;


            /**
             * 移除指定纹理
             * 
             * 注意：不是 cc.Texture2D
             */
            removeTexture(texture: any): void;


            /**
             * 纹理是否在插槽中
             * 
             * 注意：不是 cc.Texture2D
             */
            hasTexture(texture: any): boolean;


            /**
             * 获取纹理在插槽中的 Index，没有返回 -1
             * 
             * 注意：不是 cc.Texture2D
             */
            getIndex(texture: any): number;


            /**
             * 获取指定 index 中的纹理
             * 
             * 注意：不是 cc.Texture2D
             */
            getTexture(index: number): any;


            /**
             * 获取空插槽 Index，没有返回 -1
             */
            getEmptyIndex(): number;


            /**
             * 自动设置纹理到空插槽，返回插槽下标，失败返回 -1（提供 cc.Texture2D）
             */
            autoSetTexture(texture: cc.Texture2D): number;

        }

        /**
         * 多纹理合批管理器
         */
        class MultiBatcher {

            /**
             * 多纹理材质管理器数组
             */
            handlers: MultiHandler[];

            /**
             * 有空槽的材质
             */
            nextHandler: MultiHandler;


            /**
             * 初始化
             */
            init(): void;


            /**
             * 传入 cc.Texture2D，会关联并返回一个多纹理材质，如果已经有关联的材质则会返回已关联的材质
             */
            requsetMaterial(texture: cc.Texture2D): cc.Material;


            /**
             * 重置多纹理材质数组，再次使用请先初始化
             */
            reset(): void;

        }

    };

    namespace RenderComponent {

        export enum EnableType {
            /**
             * !#en Global.
             * !#zh 使用全局值
             * @property {Number} GLOBAL
             */
            GLOBAL = 0,
            /**
             * !#en Enable.
             * !#zh 开启
             * @property {Number} ENABLE
             */
            ENABLE = 1,
            /**
             * !#en Disable.
             * !#zh 关闭
             * @property {Number} DISABLE
             */
            DISABLE = 2,
        }

    }

    interface RenderComponent {

        /**
         * `updateRenderData` 时是否需要更新使用的 Texture 在材质中的 Index
         */
        _texIdDirty: boolean;

        /**
         * 使用的 Texture 在材质中的 Index
         */
        _texId: number;

        /**
         * 更新 `_texId`（使用的 Texture 在材质中的 Index）
         */
        _updateMultiTexId(material: cc.MaterialVariant, texture: cc.Texture2D);

    }

    interface Label {

        /**
         * 是否自动切换至贴图关联的材质
         */
        autoSwitchMaterial: cc.RenderComponent.EnableType;

        /**
         * 是否参与动态合图
         */
        allowDynamicAtlas: cc.RenderComponent.EnableType;

        /**
         * 是否启用渲染时进行缩放以适配高 DPI 屏幕
         */
        enableRetina: cc.RenderComponent.EnableType;

        /**
         * 置渲染数据刷新脏标记
         */
        setVertsDirty(): void;

    }

    namespace Label {

        /**
         * CHAR 缓存模式单图集类
         */
        class LetterAtlas {

            /**
             * 所属图集管理器
             */
            _atlases: cc.Label.LetterAtlases;

            /**
             * 图集纹理
             */
            _texture: cc.RenderTexture;

            /**
             * 在管理器图集数组中的下标
             */
            _id: number;

            /**
             * 渲染时用的临时变量
             */
            _tmpId: number;

            /**
             * 废弃字符区域数组
             */
            frees: cc.BitmapFont.FontLetterDefinition[];

            /**
             * 可能可以进行回收的字符区域数组
             */
            waitCleans: cc.BitmapFont.FontLetterDefinition[];

            /**
             * 重置图集
             */
            reset(): void;

            /**
             * 销毁
             */
            destroy(): void;

        }

        /**
         * CHAR 缓存模式图集管理类
         */
        class LetterAtlases {

            /**
             * 图集数组
             */
            atlases: any[];

            /**
             * Char 多纹理材质
             */
            material: cc.Material;

            /**
             * Fake MaterialVariant
             */
            fakeMaterial: { material: cc.Material };

            /**
             * 抽象字体图集 cc.BitmapFont.FontAtlas
             */
            _fontDefDictionary: any;

            /**
             * 使用该接口在显示字符前将字符打入 CHAR 图集
             */
            getLetterDefinitionForChar(char: string, labelInfo: any): any;

            /**
             * 获取已存在的字符信息
             */
            getLetter(key: string): cc.BitmapFont.FontLetterDefinition;

            /**
             * 从图集中删除字符
             */
            deleteLetter(letter: cc.BitmapFont.FontLetterDefinition): void;

            /**
             * 重置所有图集
             */
            reset(): void;

            /**
             * 销毁
             */
            destroy(): void;

        }

        /**
         * CHAR 缓存模式图集管理器
         */
        const _shareAtlas: LetterAtlases;

    }

    namespace BitmapFont {

        /**
         * Letter 信息类
         */
        class FontLetterDefinition {

            u: number;
            v: number;
            w: number;
            h: number;
            offsetX: number;
            offsetY: number;
            textureID: number;
            valid: boolean;
            xAdvance: number;
            texture: cc.Texture2D;
            atlas: cc.Label.LetterAtlas;
            ref: number;
            _inCleans: boolean;
            _hash: string;
            _width: number;
            _height: number;

        }

    }

    interface Sprite {

        /**
         * 是否自动切换至贴图关联的材质
         */
        autoSwitchMaterial: cc.RenderComponent.EnableType;

        /**
         * 是否参与动态合图
         */
        allowDynamicAtlas: cc.RenderComponent.EnableType;

        /**
         * 置渲染数据刷新脏标记
         */
        setVertsDirty(): void;

    }

    interface RichText {

        /**
         * 自定义内部使用的材质
         */
        customMaterial: cc.Material;

        /**
         * 是否自动切换至贴图关联的材质
         */
        autoSwitchMaterial: cc.RenderComponent.EnableType;

        /**
         * 是否参与动态合图
         */
        allowDynamicAtlas: cc.RenderComponent.EnableType;

        /**
         * 是否启用渲染时进行缩放以适配高 DPI 屏幕
         */
        enableRetina: cc.RenderComponent.EnableType;

        /**
         * 置渲染数据刷新脏标记
         */
        setVertsDirty(): void;

    }

    interface MotionStreak {

        /**
         * 是否自动切换至贴图关联的材质
         */
        autoSwitchMaterial: cc.RenderComponent.EnableType;

        /**
         * 检查并切换至纹理关联的材质
         */
        _checkSwitchMaterial(): void;

        /**
         * 置渲染数据刷新脏标记
         */
        setVertsDirty(): void;

    }

    interface Texture2D {

        /**
         * 关联的多纹理材质
         */
        _multiMaterial: cc.Material;

        /**
         * 关联指定材质，返回是否成功
         * 
         * @param material 材质
         * @param index 材质纹理插槽下标，默认自动寻找第一个空插槽
         */
        linkMaterial(material: cc.Material, index?: number): boolean;

        /**
         * 取消已关联的材质
         */
        unlinkMaterial(): void;

        /**
         * 获取已关联的材质
         */
        getLinkedMaterial(): cc.Material;

        /**
         * 是否已关联材质
         */
        hasLinkedMaterial(): boolean;

    }

    interface Material {

        /**
         * 所属 MultiHandler 实例
         */
        _multiHandler?: cc.sp.MultiHandler;

        /**
         * 根据材质的 `USE_MULTI_TEXTURE` 宏来更新材质是否支持多纹理
         */
        updateMultiSupport(): boolean;

        /**
         * 判断该材质是否有 MultiHandler 实例
         */
        isMultiSupport(): boolean;

        /**
         * 设置该材质是否持有 MultiHandler 实例
         */
        setMultiSupport(bool: boolean): void;

        /**
         * 获取 MultiHandler 实例
         */
        getMultiHandler(): cc.sp.MultiHandler;

    }

    namespace DynamicAtlasManager {

        /**
         * 动态图集类
         */
        class Atlas {

            /**
             * 当自由空间的某边长度不足该值则直接忽略该空间
             */
            static ignoreRectSize: number;

            /**
             * 默认 Atlas
             */
            static DEFAULT_HASH: string;

            /**
             * 宽度
             */
            width: number;

            /**
             * 高度
             */
            height: number;

            /**
             * 间距
             */
            padding: number;

            /**
             * 边距
             */
            border: number;

            /**
             * 根矩形
             */
            rootRect: Rect;

            /**
             * 自由空间
             */
            freeRects: Rect[];

            /**
             * 已使用数量
             */
            _count: number;

            /**
             * cc.RenderTexture
             */
            _texture: cc.RenderTexture;

            /**
             * texture update dirty
             */
            _dirty: boolean;


            constructor(width: number, height: number, padding?: number, border?: number);


            /**
             * push to free rects
             */
            protected pushFreeRect(rect: Rect): void;


            /**
             * faster remove from free rects
             */
            protected removeFreeRect(index: number): void;


            /**
             * change member from free rects
             */
            protected replaceFreeRect(index: number, rect: Rect): void;


            /**
             * 插入 SpriteFrame
             */
            insertSpriteFrame(spriteFrame: cc.SpriteFrame): { x: number, y: number, texture: cc.Texture2D };


            /**
             * 删除精灵帧
             */
            deleteSpriteFrame(texture: cc.Texture2D, frame: cc.SpriteFrame): boolean;


            /**
             * 删除子矩形
             */
            deleteInnerRect(rect: Rect): void;


            /**
             * 删除贴图
             */
            deleteInnerTexture(texture: cc.Texture2D): boolean;


            /**
             * 是否未使用
             */
            isEmpty(): boolean;


            /**
             * 清空
             */
            reset(): void;


            /**
             * 销毁
             */
            destroy(): void;

        }

        /**
         * 动态图集的子矩形空间类
         */
        class Rect {

            /**
             * 复用
             */
            static reuse(atlas: Atlas, width: number, height: number, x: number, y: number): cc.DynamicAtlasManager.Rect;

            /**
             * 回收
             */
            static recycle(rect: Rect): void;

            /**
             * 所属 Atlas
             */
            atlas: Atlas;

            /**
             * 宽度
             */
            width: number;

            /**
             * 高度
             */
            height: number;

            /**
             * 横坐标
             */
            x: number;

            /**
             * 纵坐标
             */
            y: number;

            /**
             * 在 freeRects 中的下标
             */
            cacheIndex: number;

            /**
             * cc.Texture2D UUID
             */
            uuid: string;

            /**
             * 使用该贴图的精灵帧数组
             */
            spriteFrames: cc.SpriteFrame[] = [];

            /**
             * 父矩形
             */
            parentRect: Rect | undefined;

            /**
             * 子矩形之一
             */
            subRectA: Rect | undefined;

            /**
             * 子矩形之一
             */
            subRectB: Rect | undefined;

            /**
             * 子矩形之一
             */
            subRectC: Rect | undefined;

            /**
             * 子矩形或自身计数
             */
            used: number;

            /**
             * 像素数
             */
            readonly sizes: number;


            constructor(atlas: Atlas, width: number, height: number, x: number, y: number);

        }

    }

    interface DynamicAtlasManager {

        /**
         * !#en Is enable autoMultiBatch.
         * !#zh 是否开启自动多纹理合批
         * @property autoMultiBatch
         * @type {Boolean}
         */
        autoMultiBatch: boolean;

        /**
         * !#en Is enable autoResetBeforeSceneLoad.
         * !#zh 是否在场景切换时清空所有图集
         * @property autoResetBeforeSceneLoad
         * @type {Boolean}
         */
        autoResetBeforeSceneLoad: boolean;

        /**
         * 图集数组
         */
        atlases: cc.DynamicAtlasManager.Atlas[];

        /**
         * 已用空间集合 <`texture._uuid`, Rect>
         */
        rects: Record<string, cc.DynamicAtlasManager.Rect>;

        /**
         * !#en Delete a sprite frame from the dynamic atlas.
         * !#zh 使精灵帧取消使用动态图集
         * @method deleteSpriteFrame
         * @param {SpriteFrame} spriteFrame
         */
        deleteSpriteFrame(spriteFrame: cc.SpriteFrame): void;

        /**
         * !#en Delete a texture from the dynamic atlas.
         * !#zh 从动态图集删除该贴图，使用该贴图的精灵帧会被还原
         * @method deleteTexture
         * @param {Texture2D} texture
         */
        deleteTexture(texture: cc.Texture2D): void;

    }



}

declare module sp {

    /**
     * Spine Attachment 的 Region 数据
     */
    class RegionData {

        /**
         * 根据当前 `x` `y` `width` `height` `texture` 更新 uv 数据
         */
        static updateUV(region: RegionData | spine.TextureAtlasRegion): void;

        x: number;
        y: number;
        degrees: number;
        texture2D: cc.Texture2D;
        texture: any;
        u: number;
        v: number;
        u2: number;
        v2: number;
        width: number;
        height: number;
        rotate: boolean;
        offsetX: number;
        offsetY: number;
        originalWidth: number;
        originalHeight: number;

        constructor(attachmentOrSpriteFrame?: spine.Attachment | cc.SpriteFrame);

        /**
         * 使用 SpriteFrame 的数据初始化 RegionData
         */
        initWithSpriteFrame(spriteFrame: cc.SpriteFrame): void;

        /**
         * 使用 Attachment 的数据初始化 RegionData
         */
        initWithAttachment(attachment: spine.Attachment): void;

        /**
         * 根据当前 `x` `y` `width` `height` `texture` 更新 uv 数据
         */
        updateUV(): void;

        /**
         * 使用 PackedFrame 对象更新 RegionData
         */
        updateWithPackedFrame(packedFrame: any): void;

        /**
         * 使用 Texture2D 对象更新 RegionData
         */
        updateWithTexture2D(texture2d: cc.Texture2D): void;

        /**
         * 转为 SpriteFrame
         * 
         * 注意：SpriteFrame 只支持两个旋转角度，如果 region 的旋转角度不是 270 或 0 度，则不能完美转换。
         * 
         * @param strict 严格模式，开启时如果无法完美转换则返回 `null`，默认 `false`
         */
        toSpriteFrame(strict?: boolean): cc.SpriteFrame;

        /**
         * 将数据更新到 Attachment
         * 
         * @param strict 严格模式，是否确保数据被同步，默认开启
         * @param resetDynamicAtlas 如果正在使用动态图集，则先还原，默认开启
         */
        assignToAttachment(attachment: spine.Attachment, strict?: boolean, resetDynamicAtlas?: boolean): void;

    }

    interface SkeletonData {

        /**
         * 克隆该 SkeletonData
         * 
         * 注意：将会克隆原始数据而不是运行时数据
         */
        clone(): SkeletonData;

    }

    interface Skeleton {

        /**
         * 是否自动切换至贴图关联的材质
         */
        autoSwitchMaterial: cc.RenderComponent.EnableType;

        /**
         * 参与动态合图
         */
        allowDynamicAtlas: cc.RenderComponent.EnableType;

        /**
         * 通过 slot 和 attachment 的名称获取 attachment 上的 region 数据。Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
         */
        getRegionData(slotName: string, attachmentName: string): sp.RegionData | null;

        /**
         * 通过 slot 和 attachment 的名称设置 attachment 上的 region 数据。Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
         */
        setRegionData(slotName: string, attachmentName: string, region: sp.RegionData): boolean;

        /**
         * 置渲染数据刷新脏标记
         */
        setVertsDirty(): void;

    }

}

