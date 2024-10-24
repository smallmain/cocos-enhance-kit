require("./macro");
require("./ipc-main.js");
require("./handlers.js");

module.exports = {
    init(callback) {
        if (CC_USE_WORKER) {
            var t = Date.now();
            ipcMain.init(() => {
                console.log("worker init cost:", Date.now() - t);
                console.log("worker settings:", {
                    CC_USE_WORKER,
                    CC_WORKER_DEBUG,
                    CC_WORKER_ASSET_PIPELINE,
                    CC_WORKER_AUDIO_SYSTEM,
                    CC_WORKER_SCHEDULER,
                    CC_WORKER_FS_SYNC,
                    CC_WORKER_SUB_PACKAGE,
                });
                callback && callback();
            });
        } else {
            callback && callback();
        }
    },
};
