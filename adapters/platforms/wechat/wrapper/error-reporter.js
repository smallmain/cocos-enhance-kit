
// Display error on the screen
function onErrorMessageHandler (info) {

    // display once in any case
    wx.offError && wx.offError(onErrorMessageHandler);

    var allowTrigger = Math.random() < 0.01;
    if (__globalAdapter.isSubContext || !allowTrigger) {
        return;
    }

    var env = wx.getSystemInfoSync();
    if (!env) {
        return;
    }

    if (!cc.Canvas.instance) {
        return;
    }

    var root = cc.Canvas.instance.node
    if (!root) {
        return;
    }

    var padding = 60;
    var node = new cc.Node();
    node.color = cc.Color.BLACK;

    var label = node.addComponent(cc.Label);
    node.height = root.height - padding;
    node.width = root.width - padding;
    label.overflow = cc.Label.Overflow.SHRINK;
    label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
    label.verticalAlign = cc.Label.VerticalAlign.TOP;
    label.fontSize = 24;
    label.string = '出错了，请截屏发送给游戏开发者（Please send this screenshot to the game developer）\n' +
                   'Platform: WeChat ' + env.version + '\n' +
                   'Engine: Cocos Creator v' + window.CocosEngine + '\n' +
                   'Device: ' + env.brand + ' ' + env.model + ' System: ' + env.system + '\n' +
                   'Error:\n' +
                   info.message;

    if (cc.LabelOutline) {
        node.addComponent(cc.LabelOutline).color = cc.Color.WHITE;
    }

    node.once('touchend', function () {
        node.destroy();
        setTimeout(function () {
            cc.director.resume();
        }, 1000);
    });

    node.parent = root;
    cc.director.pause();
}

wx.onError && wx.onError(onErrorMessageHandler);
