const _global = GameGlobal;
const adapter = _global.__globalAdapter = {};

let inited = false;
let _callback = null;
let _wait_worker_t = 0;

Object.assign(adapter, {
    init() {
        const { init: initWorker } = require('./worker');
        initWorker(() => {
            inited = true;
            if (CC_USE_WORKER && _callback) {
                console.log("worker waiting time:", Date.now() - _wait_worker_t);
            }
            _callback && _callback();
            _callback = null;
        });
        require('./wrapper/builtin');
        _global.DOMParser = require('../../common/xmldom/dom-parser').DOMParser;
        require('./wrapper/unify');
        require('./wrapper/fs-utils');
        require('../../common/engine/globalAdapter');
        require('./wrapper/systemInfo');
    },

    adaptEngine() {
        require('./wrapper/error-reporter');
        require('../../common/engine');
        require('./wrapper/engine');
        require('./wrapper/sub-context-adapter');
    },

    onInited(callback) {
        _wait_worker_t = Date.now();
        if (inited) {
            if (CC_USE_WORKER) {
                console.log("worker waiting time:", Date.now() - _wait_worker_t);
            }
            callback();
        } else {
            _callback = callback;
        }
    },
});
