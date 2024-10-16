const adapter = window.__globalAdapter;
const env = wx.getSystemInfoSync();
let adaptSysFunc = adapter.adaptSys;

Object.assign(adapter, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys);
        // TODO: add mac platform
        if (env.platform === 'windows') {
            sys.isMobile = false;
            sys.os = sys.OS_WINDOWS;
        }
        else if (adapter.isDevTool) {
            let system = env.system.toLowerCase();
            if (system.indexOf('android') > -1) {
                sys.os = sys.OS_ANDROID;
            }
            else if (system.indexOf('ios') > -1) {
                sys.os = sys.OS_IOS;
            }
        }
        // wechatgame subdomain
        if (!wx.getOpenDataContext) {
            sys.platform = sys.WECHAT_GAME_SUB;
        }
        else {
          sys.platform = sys.WECHAT_GAME;
        }

        // sys.glExtension = function (name) {
        //     if (name === 'OES_texture_float') {
        //         return false;
        //     }
        //     return !!cc.renderer.device.ext(name);
        // };

        // move to common if other platforms support
        sys.getSafeAreaRect = function () {
            let view = cc.view;
            let safeArea = adapter.getSafeArea();
            let screenSize = view.getFrameSize(); // Get leftBottom and rightTop point in UI coordinates
            let leftBottom = new cc.Vec2(safeArea.left, safeArea.bottom);
            let rightTop = new cc.Vec2(safeArea.right, safeArea.top); // Returns the real location in view.
            let relatedPos = {
                left: 0,
                top: 0,
                width: screenSize.width,
                height: screenSize.height
            };
            view.convertToLocationInView(leftBottom.x, leftBottom.y, relatedPos, leftBottom);
            view.convertToLocationInView(rightTop.x, rightTop.y, relatedPos, rightTop); // convert view point to design resolution size
            view._convertPointWithScale(leftBottom);
            view._convertPointWithScale(rightTop);
            return cc.rect(leftBottom.x, leftBottom.y, rightTop.x - leftBottom.x, rightTop.y - leftBottom.y);
        };
    },
});