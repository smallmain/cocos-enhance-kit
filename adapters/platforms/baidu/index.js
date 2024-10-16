const _global = GameGlobal;
const adapter = _global.__globalAdapter = {};

Object.assign(adapter, {
    init () {
        require('./wrapper/builtin');
        _global.DOMParser = require('../../common/xmldom/dom-parser').DOMParser;
        require('./wrapper/unify');
        require('./wrapper/fs-utils');
        require('../../common/engine/globalAdapter');
        require('./wrapper/systemInfo');
    },

    adaptEngine () {
        require('../../common/engine');
        require('./wrapper/engine');
        require('./wrapper/sub-context-adapter');
    },

    handleSystemInfo (cb) {
        if (swan.getOpenDataContext) {
            swan.getOpenDataContext().postMessage({
                fromAdapter: true,
                event: 'main-context-info',
                sysInfo: __globalAdapter.getSystemInfoSync(),  // send system info to open data context
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio,
            });
            cb && cb();
        }
        else {
            swan.onMessage(function (data) {
                if (data.fromAdapter) {
                    if (data.event === 'main-context-info') {
                        GameGlobal._env = data.sysInfo;  // revieve system info from main context
                        Object.defineProperties(window, {
                            'innerWidth': {
                                value: data.innerWidth,
                                enumerable: true,
                            },
                            'innerHeight': {
                                value: data.innerHeight,
                                enumerable: true,
                            },
                            'devicePixelRatio': {
                                value: data.devicePixelRatio,
                                enumerable: true,
                            },
                        });

                        cb && cb();
                    }
                }
            });
        }
    },
});