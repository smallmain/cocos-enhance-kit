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
    mainArea: cc.Node = null;


    start() {
        this.home.on('toggle', (toggle: cc.Toggle) => {
            if (toggle.isChecked) {
                this.changePage(toggle.node);
            }
        });

        this.multiMaterial.on('toggle', (toggle: cc.Toggle) => {
            if (toggle.isChecked) {
                this.changePage(toggle.node);
            }
        });

        this.multiBatcher.on('toggle', (toggle: cc.Toggle) => {
            if (toggle.isChecked) {
                this.changePage(toggle.node);
            }
        });
    }

    tick = 0;

    changePage(node: cc.Node) {
        const cur = ++this.tick;
        const map = new Map<cc.Node, { bundle: string, path: string }>([

            [this.multiMaterial, { bundle: "multi-render", path: "multi-material/multi-material" }],

            [this.multiBatcher, { bundle: "multi-render", path: "multi-batcher/multi-batcher" }],

        ]);

        this.mainArea.destroyAllChildren();

        const route = map.get(node);
        if (route) {
            cc.assetManager.loadBundle(route.bundle, (err, bundle) => {
                if (!err) {
                    bundle.load(route.path, cc.Prefab, (err, prefab: cc.Prefab) => {
                        if (!err && cur === this.tick) {
                            this.mainArea.addChild(cc.instantiate(prefab));
                        }
                    });
                }
            });
        }
    }

}
