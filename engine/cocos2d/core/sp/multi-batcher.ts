import { MultiHandler } from "./multi-handler";


/**
 * 多纹理合批器
 */
export class MultiBatcher {

    /**
     * 多纹理材质管理器数组
     */
    handlers: MultiHandler[] = [];

    /**
     * 有空槽的材质
     */
    nextHandler!: MultiHandler;


    /**
     * 初始化
     */
    init() {
        const handler = new MultiHandler();
        this.handlers.push(handler);
        this.nextHandler = handler;
    }


    /**
     * 传入 cc.Texture2D，会关联并返回一个多纹理材质，如果已经有关联的材质则会返回已关联的材质
     */
    requsetMaterial(texture: any) {
        if (!texture._multiMaterial) {
            let handler = this.nextHandler;
            let index = handler.getEmptyIndex();
            if (index === -1) {
                // 没有空位，尝试在已有 handlers 里查找
                for (const _handler of this.handlers) {
                    index = _handler.getEmptyIndex();
                    if (index !== -1) {
                        handler = _handler;
                        this.nextHandler = handler;
                        break;
                    }
                }

                // 已有的没有空位，创建新材质
                if (index === -1) {
                    handler = new MultiHandler();
                    this.handlers.push(handler);
                    this.nextHandler = handler;
                    index = 0;
                }
            }

            texture.linkMaterial(handler.material, index);
        }
        return texture._multiMaterial;
    }


    /**
     * 重置多纹理材质数组，再次使用请先初始化
     */
    reset() {
        this.handlers.length = 0;
    }

}


cc.sp.multiBatcher = new MultiBatcher();
cc.sp.MultiBatcher = MultiBatcher;
