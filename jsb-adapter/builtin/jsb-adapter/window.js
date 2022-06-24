function inject () {
    window.top = window.parent = window

    window.ontouchstart = null;
    window.ontouchmove = null;
    window.ontouchend = null;
    window.ontouchcancel = null;

    window.pageXOffset = window.pageYOffset = window.clientTop = window.clientLeft = 0;
    window.outerWidth = window.innerWidth;
    window.outerHeight = window.innerHeight;

    window.location = require('./location');
    window.document = require('./document');
    window.Element = require('./Element');
    window.HTMLElement = require('./HTMLElement');
    window.HTMLCanvasElement = require('./HTMLCanvasElement');
    window.HTMLImageElement = require('./HTMLImageElement');
    window.HTMLMediaElement = require('./HTMLMediaElement');
    window.HTMLVideoElement = require('./HTMLVideoElement');
    window.HTMLScriptElement = require('./HTMLScriptElement');
    window.__canvas = new HTMLCanvasElement();
    window.__canvas._width = window.innerWidth;
    window.__canvas._height = window.innerHeight;
    window.__gl.canvas = window.__canvas;
    window.navigator = require('./navigator');
    window.Image = require('./Image');
    window.FileReader = require('./FileReader');
    window.FontFace = require('./FontFace');
    window.FontFaceSet = require('./FontFaceSet');
    window.EventTarget = require('./EventTarget');
    window.Event = require('./Event');
    window.TouchEvent = require('./TouchEvent');
    window.MouseEvent = require('./MouseEvent');
    window.KeyboardEvent = require('./KeyboardEvent');
    window.DeviceMotionEvent = require('./DeviceMotionEvent');


    // window.devicePixelRatio is readonly
    Object.defineProperty(window, "devicePixelRatio", {
        get: function() {
            return jsb.device.getDevicePixelRatio ? jsb.device.getDevicePixelRatio() : 1;
        },
        set: function(_dpr) {/* ignore */},
        enumerable: true,
        configurable: true
    });

    window.addEventListener = function(eventName, listener, options) {
        window.__canvas.addEventListener(eventName, listener, options);
    };

    window.removeEventListener = function(eventName, listener, options) {
        window.__canvas.removeEventListener(eventName, listener, options);
    };

    window.dispatchEvent = function(event) {
        window.__canvas.dispatchEvent(event);
    };

    window.screen = {
        availTop: 0,
        availLeft: 0,
        availHeight: window.innerWidth,
        availWidth: window.innerHeight,
        colorDepth: 8,
        pixelDepth: 8,
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: { //FIXME:cjh
            type: 'portrait-primary' // portrait-primary, portrait-secondary, landscape-primary, landscape-secondary
        },

        //screen orientation enum
        SCREEN_ORIENTATION: {
            ROTATION_0: 0,
            ROTATION_90: 1,
            ROTATION_180: 2,
            ROTATION_270: 3
        },

        onOrientationChanged: function(event) {
            switch (event.rotation) {
                case window.screen.SCREEN_ORIENTATION.ROTATION_0:
                    window.orientation = 0;
                    break;
                case window.screen.SCREEN_ORIENTATION.ROTATION_90:
                    window.orientation = 90;
                    break;
                case window.screen.SCREEN_ORIENTATION.ROTATION_180:
                    window.orientation = 180;
                    break;
                case window.screen.SCREEN_ORIENTATION.ROTATION_270:
                    window.orientation = -90;
                    break;
                default:
                    break;
            }

            // emit resize consistent with web behavior
            let resizeEvent = new Event('orientationchange');
            window.dispatchEvent(resizeEvent);
        }
    };

    jsb.onOrientationChanged = function (event) {
        window.screen.onOrientationChanged(event);
    };

    window.screen.onOrientationChanged({rotation: jsb.device.getDeviceRotation()});

    window.getComputedStyle = function(element) {
        return {
           position: 'absolute',
           left:     '0px',
           top:      '0px',
           height:   '0px'
        };
    };

    window.resize = function (width, height) {
        window.innerWidth = width;
        window.innerHeight = height;
        window.outerWidth = window.innerWidth;
        window.outerHeight = window.innerHeight;
        window.__canvas._width = window.innerWidth;
        window.__canvas._height = window.innerHeight;
        window.screen.availWidth = window.innerWidth;
        window.screen.availHeight = window.innerHeight;
        window.screen.width = window.innerWidth;
        window.screen.height = window.innerHeight;
        // emit resize consistent with web behavior
        let resizeEvent = new Event('resize');
        resizeEvent._target = window;
        window.dispatchEvent(resizeEvent);
    };
    
    window.focus = function() {};
    window.scroll = function() {};

    window._isInjected = true;
}

if (!window._isInjected) {
    inject();
}


window.localStorage = sys.localStorage;
