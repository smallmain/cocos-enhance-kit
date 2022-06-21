const { ccclass, property } = cc._decorator;

@ccclass
export default class Home extends cc.Component {

    @property(cc.Label)
    objectNumLabel: cc.Label = null;

    @property(cc.Slider)
    objectNumSlider: cc.Slider = null;

    @property(cc.Node)
    enbaleMultiNode: cc.Node = null;

    @property(cc.Node)
    objects: cc.Node = null;

    nums = [10, 10000];
    num = this.nums[0];

    enableMultiRender = true;

    prefabs: cc.Node[] = [];

    protected onLoad(): void {
        this.prefabs = this.objects.children.concat();
        this.objects.removeAllChildren(false);

        this.objectNumSlider.node.on('slide', (slider: cc.Slider) => {
            const offset = (this.nums[1] - this.nums[0]) * slider.progress;
            this.num = this.nums[0] + Math.ceil(offset);
            this.numUpdate();
        });

        this.enbaleMultiNode.on('toggle', (toggle: cc.Toggle) => {
            this.enableMultiRender = toggle.isChecked;
            this.multiRenderUpdate();
        });

        this.objectNumSlider.progress = 0.02;
        const offset = (this.nums[1] - this.nums[0]) * this.objectNumSlider.progress;
        this.num = this.nums[0] + Math.ceil(offset);
        this.numUpdate();
        this.multiRenderUpdate();
    }


    numUpdate() {
        this.objectNumLabel.string = `对象数量：${this.num}`;

        let offset = this.num - this.objects.children.length;

        if (offset > 0) {
            for (let i = 0; i < offset; i++) {
                this.createObject();
            }
        } else {
            offset = -offset;
            for (let i = 0; i < offset; i++) {
                this.objects.children[i].destroy();
            }
        }
    }


    multiRenderUpdate() {
        this.reCreateObjects();
    }


    reCreateObjects() {
        this.objects.destroyAllChildren();
        for (let i = 0; i < this.num; i++) {
            this.createObject();
        }
    }


    createObject() {
        const random = Math.floor(Math.random() * this.prefabs.length);
        const node = cc.instantiate(this.prefabs[random]);

        if (this.enableMultiRender) {
            const comp = node.getComponent(cc.Label) ?? node.getComponent(cc.Sprite) ?? node.getComponent(cc.RichText) ?? node.getComponent(sp.Skeleton);
            comp.autoSwitchMaterial = cc.RenderComponent.EnableType.ENABLE;
            comp.allowDynamicAtlas = cc.RenderComponent.EnableType.ENABLE;
        }

        this.objects.addChild(node);

        node.position = cc.v3(Math.floor(Math.random() * this.objects.width), Math.floor(Math.random() * this.objects.height));
        cc.tween(node).by(3, { angle: 360 }).repeatForever().start();
    }

}
