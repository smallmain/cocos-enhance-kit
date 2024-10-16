// Ensure recieving message from main context before engine being inited
let isEngineReady = false;
const game = cc.game;
game.once(game.EVENT_ENGINE_INITED, function () {
    isEngineReady = true;
});

var viewportInMain = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

// Touch conversion
cc.view.convertToLocationInView = function (tx, ty, relatedPos, out) {
    var result = out || cc.v2();
    var x = this._devicePixelRatio * (tx - relatedPos.left);
    var y = this._devicePixelRatio * (relatedPos.top + relatedPos.height - ty);
    // Move to real viewport area
    x = (x - viewportInMain.x) * this._viewportRect.width / viewportInMain.width;
    y = (y - viewportInMain.y) * this._viewportRect.height / viewportInMain.height;
    if (this._isRotated) {
        result.x = this._viewportRect.width - y;
        result.y = x;
    }
    else {
        result.x = x;
        result.y = y;
    }
    return result;
};

// In sub context, run main loop after subContextView component get enabled.
game._prepareFinished = function (cb) {
    this._prepared = true;

    // Init engine
    this._initEngine();
    cc.assetManager.builtins.init(() => {
        // Log engine version
        console.log('Cocos Creator v' + cc.ENGINE_VERSION);

        this._setAnimFrame();
        
        this.emit(this.EVENT_GAME_INITED);

        if (cb) cb();
    });
};

swan.onMessage(function (data) {
    if (data.fromEngine) {
        if (data.event === 'boot') {
            game._banRunningMainLoop = false;
            if (game._firstSceneLaunched) {
                game._runMainLoop();
            }
        }
        else if (data.event === 'viewport') {
            viewportInMain.x = data.x;
            viewportInMain.y = data.y;
            viewportInMain.width = data.width;
            viewportInMain.height = data.height;
        }
        else if (data.event === 'resize') {
            window.dispatchEvent({type: 'resize'});
        }
        else if (isEngineReady) {
            if (data.event === 'mainLoop') {
                if (data.value) {
                    game.resume();
                }
                else {
                    game.pause();
                }
            }
            else if (data.event === 'frameRate') {
                game.setFrameRate(data.value);
            }
            else if (data.event === 'step') {
                game.step();
            }
        }
    }
});

// Canvas component adaptation

cc.Canvas.prototype.update = function () {
    if (this._width !== game.canvas.width || this._height !== game.canvas.height) {
        this.applySettings();
    }
};

let originalApplySettings = cc.Canvas.prototype.applySettings;
cc.Canvas.prototype.applySettings = function () {
    originalApplySettings.call(this);
    this._width = game.canvas.width;
    this._height = game.canvas.height;
};