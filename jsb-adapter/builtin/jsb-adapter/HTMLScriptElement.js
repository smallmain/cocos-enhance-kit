const HTMLElement = require('./HTMLElement');
const Event = require('./Event');

class HTMLScriptElement extends HTMLElement {
    constructor(width, height) {
        super('script')

    }

    set src(url) {
        setTimeout(()=>{
            require(url);
            this.dispatchEvent(new Event('load'));
        }, 0);
    }
}

module.exports = HTMLScriptElement;
