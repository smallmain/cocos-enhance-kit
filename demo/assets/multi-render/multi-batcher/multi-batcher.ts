
const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiBatcher extends cc.Component {

    @property(cc.Node)
    batchBtn: cc.Node = null;

    @property(cc.Node)
    cancelBtn: cc.Node = null;

    @property(cc.Node)
    textures: cc.Node = null;


    protected onLoad(): void {
        this.batchBtn.on('click', () => {
            const batcher = new cc.sp.MultiBatcher();
            batcher.init();
            this.textures.children.forEach(v => {
                const sprite = v.getComponent(cc.Sprite);
                batcher.requsetMaterial(sprite.spriteFrame.getTexture());
                sprite.setVertsDirty();
            });
        });

        this.cancelBtn.on('click', () => {
            this.textures.children.forEach(v => {
                const sprite = v.getComponent(cc.Sprite);
                sprite.spriteFrame.getTexture().unlinkMaterial();
                sprite.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
                sprite.setVertsDirty();
            });
        });
    }

}
