// @ts-expect-error
const RenderTexture = require('../../../assets/CCRenderTexture');


/**
 * 矩形
 */
export class Rect {

    /**
     * 对象池
     */
    static pool: Rect[] = [];

    /**
     * 对象池指针
     */
    static pointer: number = 0;


    /**
     * 复用
     */
    static reuse(atlas: Atlas, width: number, height: number, x: number, y: number) {
        if (this.pointer === 0) {
            for (let i = 0; i < 128; i++) {
                Rect.pool[i] = new Rect(atlas, 0, 0, 0, 0);
            }
            this.pointer += 128;
        }

        this.pointer--;
        const rect = this.pool[this.pointer];

        rect.atlas = atlas;
        rect.width = width;
        rect.height = height;
        rect.x = x;
        rect.y = y;

        return rect;
    }


    /**
     * 回收
     */
    static recycle(rect: Rect) {
        rect.atlas = undefined!;
        rect.uuid = "";
        rect.spriteFrames.length = 0;
        rect.parentRect = undefined;
        rect.subRectA = undefined;
        rect.subRectB = undefined;
        rect.subRectC = undefined;

        rect.cacheIndex = -1;

        this.pool[this.pointer] = rect;
        this.pointer++;
    }


    /**
     * 所属 Atlas
     */
    atlas: Atlas;

    /**
     * 宽度
     */
    width: number = 0;

    /**
     * 高度
     */
    height: number = 0;

    /**
     * 横坐标
     */
    x: number = 0;

    /**
     * 纵坐标
     */
    y: number = 0;

    /**
     * 在 freeRects 中的下标
     */
    cacheIndex: number = -1;

    /**
     * cc.Texture2D UUID
     */
    uuid: string = '';

    /**
     * 使用该贴图的精灵帧数组
     */
    spriteFrames: any[] = [];

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
    used: number = 0;

    /**
     * 像素数
     */
    get sizes() {
        return this.width * this.height;
    }


    constructor(atlas: Atlas, width: number, height: number, x: number, y: number) {
        this.atlas = atlas;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

}


/**
 * 动态图集
 *
 * 装箱算法：类似断头台装箱算法
 * 合并算法：树形回退模式
 */
export class Atlas {

    /**
     * 当自由空间的某边长度不足该值则直接忽略该空间
     */
    static ignoreRectSize: number = 10;

    /**
     * 默认 Atlas
     */
    static DEFAULT_HASH = (new RenderTexture())._getHash();

    /**
     * 宽度
     */
    width: number = 0;

    /**
     * 高度
     */
    height: number = 0;

    /**
     * 间距
     */
    padding: number = 0;

    /**
     * 边距
     */
    border: number = 0;

    /**
     * 根矩形
     */
    rootRect: Rect;

    /**
     * 自由空间
     */
    freeRects: Rect[] = [];

    /**
     * 已使用数量
     */
    _count = 0;

    /**
     * cc.RenderTexture
     */
    _texture: any;

    /**
     * texture update dirty
     */
    _dirty: boolean = false;


    constructor(width: number, height: number, padding: number = 2, border: number = 2) {
        const texture = new RenderTexture();
        texture.initWithSize(width, height);
        texture.update();
        this._texture = texture;

        this.width = width;
        this.height = height;
        this.padding = padding;
        this.border = border;

        this.rootRect = Rect.reuse(
            this,
            this.width + this.padding - this.border * 2,
            this.height + this.padding - this.border * 2,
            this.border,
            this.border,
        );
        this.pushFreeRect(this.rootRect);
    }


    /**
     * push to free rects
     */
    protected pushFreeRect(rect: Rect) {
        const i = this.freeRects.push(rect) - 1;
        rect.cacheIndex = i;
    }


    /**
     * faster remove from free rects
     */
    protected removeFreeRect(index: number) {
        const temp = this.freeRects[index];
        const temp2 = this.freeRects[this.freeRects.length - 1];
        temp2.cacheIndex = index;
        temp.cacheIndex = -1;
        this.freeRects[index] = temp2;
        this.freeRects.pop();
    }


    /**
     * change member from free rects
     */
    protected replaceFreeRect(index: number, rect: Rect) {
        this.freeRects[index].cacheIndex = -1;
        rect.cacheIndex = index;
        this.freeRects[index] = rect;
    }


    /**
     * 插入 SpriteFrame
     */
    insertSpriteFrame(spriteFrame: any) {
        let rect = spriteFrame._rect,
            texture = spriteFrame._texture;

        let sx = rect.x, sy = rect.y;
        let width = texture.width, height = texture.height;

        const result = this.insert(texture);

        if (!result) {
            return null;
        }

        // texture bleeding
        if (cc.dynamicAtlasManager.textureBleeding) {
            // Smaller frame is more likely to be affected by linear filter
            if (width <= 8 || height <= 8) {
                this._texture.drawTextureAt(texture, result.x - 1, result.y - 1);
                this._texture.drawTextureAt(texture, result.x - 1, result.y + 1);
                this._texture.drawTextureAt(texture, result.x + 1, result.y - 1);
                this._texture.drawTextureAt(texture, result.x + 1, result.y + 1);
            }

            this._texture.drawTextureAt(texture, result.x - 1, result.y);
            this._texture.drawTextureAt(texture, result.x + 1, result.y);
            this._texture.drawTextureAt(texture, result.x, result.y - 1);
            this._texture.drawTextureAt(texture, result.x, result.y + 1);
        }

        this._texture.drawTextureAt(texture, result.x, result.y);

        this._count++;

        sx += result.x;
        sy += result.y;

        result.spriteFrames.push(spriteFrame);

        this._dirty = true;

        let frame = {
            x: sx,
            y: sy,
            texture: this._texture,
        };

        return frame;
    }


    /**
     * 插入子函数
     */
    insert(texture: any) {
        const width = texture.width + this.padding, height = texture.height + this.padding;
        let score = Number.MAX_VALUE;
        let areaFit = 0;
        let original: Rect | undefined = undefined;
        let originalIndex = 0;

        // 查找足够容纳的空区域
        for (let i = 0; i < this.freeRects.length; i++) {
            const rect = this.freeRects[i];
            if (rect.width >= width && rect.height >= height) {
                areaFit = rect.sizes - width * height;
                if (areaFit < score) {
                    original = rect;
                    originalIndex = i;
                    score = areaFit;
                }
            }
        }

        // 切割空区域
        if (original) {
            if (original.width === width && original.height === height) {
                original.uuid = texture._uuid;
                original.used++;
                if (original.parentRect) original.parentRect.used++;
                cc.dynamicAtlasManager.rects[texture._uuid] = original;
                this.removeFreeRect(originalIndex);
                return original;
            }

            const best = Rect.reuse(this, width, height, original.x, original.y);
            let tmp: Rect;
            if (best.y + best.height < original.y + original.height) {
                tmp = Rect.reuse(
                    this,
                    original.width,
                    original.y + original.height - (best.y + best.height),
                    original.x,
                    best.y + best.height,
                );

                tmp.parentRect = original;
                original.subRectB = tmp;

                if (tmp.width > Atlas.ignoreRectSize && tmp.height > Atlas.ignoreRectSize) {
                    // 替换旧区域
                    this.replaceFreeRect(originalIndex, tmp);
                    originalIndex = -1;
                }
            }

            if (best.x + best.width < original.x + original.width) {
                tmp = Rect.reuse(
                    this,
                    original.x + original.width - (best.x + best.width),
                    original.height - (original.y + original.height - (best.y + best.height)),
                    best.x + best.width,
                    original.y,
                );

                tmp.parentRect = original;
                original.subRectC = tmp;

                if (tmp.width > Atlas.ignoreRectSize && tmp.height > Atlas.ignoreRectSize) {
                    if (originalIndex !== -1) {
                        // 替换旧区域
                        this.replaceFreeRect(originalIndex, tmp);
                        originalIndex = -1;
                    } else {
                        this.pushFreeRect(tmp);
                    }
                }
            }

            if (originalIndex !== -1) {
                this.removeFreeRect(originalIndex);
            }

            best.parentRect = original;
            original.subRectA = best;
            best.used++;
            original.used++;
            if (original.used === 1 && original.parentRect) original.parentRect.used++;
            best.uuid = texture._uuid;
            cc.dynamicAtlasManager.rects[texture._uuid] = best;
            return best;
        } else {
            return undefined;
        }
    }


    /**
     * update texture
     */
    update() {
        if (!this._dirty) return;
        this._texture.update();
        this._dirty = false;
    }


    /**
     * 删除精灵帧
     */
    deleteSpriteFrame(texture: any, frame: any) {
        if (texture) {
            const rect: Rect | undefined = cc.dynamicAtlasManager.rects[texture._uuid];
            if (rect) {
                const index = rect.spriteFrames.indexOf(frame);
                if (index !== -1) {
                    rect.spriteFrames.splice(index, 1);

                    // 判断如果没有引用则删除 Texture
                    if (rect.spriteFrames.length === 0) {
                        rect.atlas.deleteInnerRect(rect);
                    }
                } else {
                    cc.warn('[Dynamic Atlas] can\'t find spriteFrame in Rect.');
                }

                return true;
            }
        }

        return false;
    }


    /**
     * 删除子矩形
     */
    deleteInnerRect(rect: Rect) {
        delete cc.dynamicAtlasManager.rects[rect.uuid];
        rect.uuid = "";
        this._count--;

        // 还原 SpriteFrame
        for (const spriteFrame of rect.spriteFrames) {
            if (spriteFrame.isValid) {
                spriteFrame._resetDynamicAtlasFrame();
            }
        }
        rect.spriteFrames.length = 0;

        this.tryMergeRecycle(rect);
    }


    /**
     * 删除贴图
     */
    deleteInnerTexture(texture: any) {
        if (texture) {
            const rect: Rect | undefined = cc.dynamicAtlasManager.rects[texture._uuid];
            if (rect) {
                rect.atlas.deleteInnerRect(rect);
                return true;
            }
        }
        return false;
    }


    /**
     * 尝试合并和回收
     */
    protected tryMergeRecycle(rect: Rect) {
        let old: Rect | undefined = undefined;
        let parent: Rect | undefined = rect;
        while (parent) {
            parent.used--;
            if (parent.used === 0) {
                // 回收所有子矩形
                if (parent.subRectA) {
                    // 可能是 ignoreRect
                    const i = parent.subRectA.cacheIndex;
                    if (i !== -1) {
                        this.removeFreeRect(i);
                    }
                    Rect.recycle(parent.subRectA);
                    parent.subRectA = undefined;
                }
                if (parent.subRectB) {
                    const i = parent.subRectB.cacheIndex;
                    if (i !== -1) {
                        this.removeFreeRect(i);
                    }
                    Rect.recycle(parent.subRectB);
                    parent.subRectB = undefined;
                }
                if (parent.subRectC) {
                    const i = parent.subRectC.cacheIndex;
                    if (i !== -1) {
                        this.removeFreeRect(i);
                    }
                    Rect.recycle(parent.subRectC);
                    parent.subRectC = undefined;
                }
                old = parent;
                parent = parent.parentRect;
            } else {
                if (old) {
                    if (old.width > Atlas.ignoreRectSize && old.height > Atlas.ignoreRectSize) {
                        this.pushFreeRect(old);
                    }
                }
                old = parent;
                parent = undefined;
            }
        }

        if (old === this.rootRect && old.used === 0) {
            this.pushFreeRect(old);
        }
    }


    /**
     * 是否未使用
     */
    isEmpty() {
        return this._count <= 0;
    }


    /**
     * 清空
     */
    reset() {
        const rects = cc.dynamicAtlasManager.rects;
        for (const key in rects) {
            const rect: Rect = rects[key];
            if (rect.atlas === this) {
                delete rects[key];
                for (const spriteFrame of rect.spriteFrames) {
                    if (spriteFrame.isValid) {
                        spriteFrame._resetDynamicAtlasFrame();
                    }
                }
                Rect.recycle(rect);
            }
        }

        for (const rect of this.freeRects) {
            Rect.recycle(rect);
        }

        this.freeRects.length = 0;
        this._count = 0;

        this.rootRect = Rect.reuse(
            this,
            this.width + this.padding - this.border * 2,
            this.height + this.padding - this.border * 2,
            this.border,
            this.border,
        );
        this.pushFreeRect(this.rootRect)
    }


    /**
     * 销毁
     */
    destroy() {
        this.reset();
        this._texture.destroy();
    }

}
