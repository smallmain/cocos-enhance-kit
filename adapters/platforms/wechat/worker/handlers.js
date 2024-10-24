if (CC_WORKER_ASSET_PIPELINE) {
    const assetManagerWorkerAdapter = require("./asset-manager.js");
    ipcMain.registerHandler("assetManager", assetManagerWorkerAdapter);
}

if (CC_WORKER_AUDIO_SYSTEM && cc._Audio) {
    const audioWorkerAdapter = require("./audio.js");
    ipcMain.registerHandler("audioAdapter", audioWorkerAdapter);
}
