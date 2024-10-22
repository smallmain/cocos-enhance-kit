require("./macro.js");
require("./ipc-main.js");
require("./handlers.js");

let inited = false;
let _callback = null;

module.exports = {
    init() {
        if (CC_USE_WORKER) {
            var t = Date.now();
            ipcMain.init(() => {
                console.log("worker init cost:", Date.now() - t);
                console.log("worker settings:", {
                    CC_USE_WORKER,
                    CC_WORKER_DEBUG,
                    CC_WORKER_ASSET_PIPELINE,
                    CC_WORKER_ASSET_PIPELINE_INCLUDE_LOAD,
                    CC_WORKER_SCHEDULER,
                    CC_WORKER_FS_SYNC,
                });
                inited = true;
                _callback && _callback();
                _callback = null;
            });
        } else {
            inited = true;
            _callback && _callback();
            _callback = null;
        }
    },
    onInited(callback) {
        if (inited) {
            callback();
        } else {
            _callback = callback;
        }
    },
};
