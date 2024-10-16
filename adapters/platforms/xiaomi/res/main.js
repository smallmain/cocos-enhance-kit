require('./src/settings');
require('adapter-js-path');
__globalAdapter.init();
require(window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');
require('physics-js-path');
__globalAdapter.adaptEngine();
require('./ccRequire');

// Introduce Cocos Service here
require('./boot');  // TODO: move to common

// Adjust devicePixelRatio
cc.view._maxPixelRatio = 4;

// Release Image objects after uploaded gl texture
cc.macro.CLEANUP_IMAGE_CACHE = true;

window.boot();
