const { ccclass, property } = cc._decorator;

@ccclass
export default class SpineSkin extends cc.Component {

    @property(cc.Node)
    addBoyBtn: cc.Node = null;

    @property(cc.Node)
    removeBoyBtn: cc.Node = null;

    @property(cc.Node)
    randomChangeBtn: cc.Node = null;

    @property(cc.Node)
    boy: cc.Node = null;

    @property([cc.SpriteFrame])
    heads: cc.SpriteFrame[] = [];

    boys: cc.Node[] = [];

    protected start(): void {
        const boySpine = this.boy.getComponentInChildren(sp.Skeleton);
        const newSkeletonData = boySpine.skeletonData.clone();
        boySpine.skeletonData = newSkeletonData;
        boySpine.animation = 'attack';

        this.boys.push(this.boy);

        this.addBoyBtn.on('click', () => {
            const newBoy = cc.instantiate(this.boy);
            const newBoySpine = newBoy.getComponentInChildren(sp.Skeleton);
            newBoySpine.skeletonData = boySpine.skeletonData.clone();
            newBoySpine.animation = 'attack';

            this.boy.parent.addChild(newBoy);
            newBoy.setPosition(this.boys[this.boys.length - 1].position);
            newBoy.x += 100;
            if (this.boys.length % 2 === 1) {
                newBoy.getComponentInChildren(sp.Skeleton).setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.PRIVATE_CACHE);
                newBoy.getComponentInChildren(cc.Label).string = `Spine - Cache`;
            }
            this.boys.push(newBoy);
        });

        this.removeBoyBtn.on('click', () => {
            if (this.boys.length > 1) {
                this.boys[this.boys.length - 1].destroy();
                this.boys.length -= 1;
            }
        });

        this.randomChangeBtn.on('click', () => {
            const boy = this.boys[this.boys.length - 1].getComponentInChildren(sp.Skeleton);
            boy.setRegion('Head', 'Head', sp.SkeletonData.createRegion(this.heads[Math.floor(Math.random() * (this.heads.length))]));
        });
    }

}
