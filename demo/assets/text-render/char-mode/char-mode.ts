import { chars } from "../chars";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CharMode extends cc.Component {

    @property(cc.Label)
    bitmapFont1: cc.Label = null;

    @property(cc.Label)
    bitmapFont2: cc.Label = null;

    @property(cc.Label)
    bitmapFont3: cc.Label = null;

    @property(cc.Label)
    charFont1: cc.Label = null;

    @property(cc.Label)
    charFont2: cc.Label = null;

    @property(cc.Label)
    charFont3: cc.Label = null;


    protected onLoad(): void {
        this.bitmapFont1.string = this.getRandomText(15);
        this.bitmapFont2.string = this.getRandomText(15);
        this.bitmapFont3.string = this.getRandomText(15);
        this.charFont1.string = this.getRandomText(15);
        this.charFont2.string = this.getRandomText(15);
        this.charFont3.string = this.getRandomText(15);

        this.schedule(() => {
            this.bitmapFont1.string = this.getRandomText(15);
            this.bitmapFont2.string = this.getRandomText(15);
            this.bitmapFont3.string = this.getRandomText(15);
            this.charFont1.string = this.getRandomText(15);
            this.charFont2.string = this.getRandomText(15);
            this.charFont3.string = this.getRandomText(15);
        }, 0.1);
    }


    getRandomText(length: number) {
        let str = '';
        while (str.length < length) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }

}
