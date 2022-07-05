const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Label)
    version: cc.Label = null;


    protected start(): void {
        this.version.string = `Version: v${cc.sp.version}\n`;
    }

}


cc.sp.labelRetinaScale = 2;
cc.sp.charAtlasAutoBatchCount = 2;
cc.macro.CLEANUP_IMAGE_CACHE = false;
cc.dynamicAtlasManager.maxFrameSize = 2048;
