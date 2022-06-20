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
    bitmapFont4: cc.Label = null;

    @property(cc.Label)
    charFont1: cc.Label = null;

    @property(cc.Label)
    charFont2: cc.Label = null;

    @property(cc.Label)
    charFont3: cc.Label = null;

    @property(cc.Label)
    charFont4: cc.Label = null;

    protected onLoad(): void {
        this.bitmapFont1.string = this.getRandomText(15);
        this.bitmapFont2.string = this.getRandomText(15);
        this.bitmapFont3.string = this.getRandomText(15);
        this.bitmapFont4.string = this.getRandomTextEnglish(30);
        this.charFont1.string = this.getRandomText(15);
        this.charFont2.string = this.getRandomText(15);
        this.charFont3.string = this.getRandomText(15);
        this.charFont4.string = this.getRandomTextEnglish(30);

        this.schedule(() => {
            this.bitmapFont1.string = this.getRandomText(15);
            this.bitmapFont2.string = this.getRandomText(15);
            this.bitmapFont3.string = this.getRandomText(15);
            this.bitmapFont4.string = this.getRandomTextEnglish(30);
            this.charFont1.string = this.getRandomText(15);
            this.charFont2.string = this.getRandomText(15);
            this.charFont3.string = this.getRandomText(15);
            this.charFont4.string = this.getRandomTextEnglish(30);
        }, 0.1);
    }


    getRandomText(length: number) {
        let str = '';
        while (str.length < length) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }

    enChars = "abcdefghijklmnopqrstuvwxyz.,/ 1234567890!@#$%^&*()-=_+`~,./;'<>?;[]{}|";


    getRandomTextEnglish(length: number) {
        let str = '';
        while (str.length < length) {
            str += this.enChars[Math.floor(Math.random() * this.enChars.length)];
        }
        return str;
    }

}
