const { ccclass, property } = cc._decorator;

@ccclass
export default class LeftArea extends cc.Component {

    @property(cc.Node)
    home: cc.Node = null;

    @property(cc.Node)
    multiMaterial: cc.Node = null;

    @property(cc.Node)
    multiBatcher: cc.Node = null;

    @property(cc.Node)
    charMode: cc.Node = null;

    @property(cc.Node)
    highDPI: cc.Node = null;

    @property(cc.Node)
    spineBatch: cc.Node = null;

    @property(cc.Node)
    spineSkin: cc.Node = null;

    @property(cc.Node)
    mainArea: cc.Node = null;

    tick = 0;

    map: Map<cc.Node, { bundle: string, path: string }>


    start() {
        this.map = new Map([

            [this.home, {
                bundle: "home",
                path: "home",
            }],

            [this.multiMaterial, {
                bundle: "multi-render",
                path: "multi-material/multi-material",
            }],

            [this.multiBatcher, {
                bundle: "multi-render",
                path: "multi-batcher/multi-batcher",
            }],

            [this.charMode, {
                bundle: "text-render",
                path: "char-mode/char-mode",
            }],

            [this.highDPI, {
                bundle: "text-render",
                path: "high-dpi/high-dpi",
            }],

            [this.spineBatch, {
                bundle: "spine",
                path: "batch/spine-batch",
            }],

            [this.spineSkin, {
                bundle: "spine",
                path: "skin/spine-skin",
            }],

        ]);

        this.initBtns();
        this.switchPage(this.map.get(this.home));
    }


    initBtns() {
        for (const [node, route] of this.map) {
            node.on('toggle', (toggle: cc.Toggle) => {
                if (toggle.isChecked) {
                    this.switchPage(route);
                }
            });
        }
    }


    switchPage(route: { bundle: string, path: string }) {
        const cur = ++this.tick;

        this.mainArea.destroyAllChildren();

        if (route) {
            cc.assetManager.loadBundle('common', () => {
                cc.assetManager.loadBundle(route.bundle, (err, bundle) => {
                    if (!err) {
                        bundle.load(route.path, cc.Prefab, (err, prefab: cc.Prefab) => {
                            if (!err && cur === this.tick) {
                                this.mainArea.addChild(cc.instantiate(prefab));
                            }
                        });
                    }
                });
            });
        }
    }

}
