
const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiBatcher extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    protected onLoad(): void {

    }
}
