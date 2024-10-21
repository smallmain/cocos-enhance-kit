require("./macro.js");
require("./ipc-main.js");
require("./handlers.js");

module.exports = function init(callback) {
    if (CC_USE_WORKER) {
        var t = Date.now();
        ipcMain.init(() => {
            console.log("worker init cost:", Date.now() - t);
            callback();
        });
    } else {
        callback();
    }
}
