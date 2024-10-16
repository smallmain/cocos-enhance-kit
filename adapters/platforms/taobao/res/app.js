var onShowCB;
var onHideCB;

App({
  onLaunch(options) {
    console.info('App onLaunched');
    $global.__cocosCallback = function () {
      require('./ccRequire');
      require('adapter-js-path');
      __globalAdapter.init();
      require('cocos2d-js-path');
      require('physics-js-path');
      __globalAdapter.adaptEngine();
      
      require('./src/settings');
      // Introduce Cocos Service here
      require('./main');  // TODO: move to common
      
      // Adjust devicePixelRatio
      cc.view._maxPixelRatio = 4;
      
      // Release Image objects after uploaded gl texture
      cc.macro.CLEANUP_IMAGE_CACHE = true;
      
      window.boot();
    };

    __globalAdapter.onShow = function (cb) {
      onShowCB = cb;
    };
    __globalAdapter.onHide = function (cb) {
      onHideCB = cb;
    };
  },
  onShow(options) {
    onShowCB && onShowCB();
  },
  onHide(options) {
    onHideCB && onHideCB();
  },
});
