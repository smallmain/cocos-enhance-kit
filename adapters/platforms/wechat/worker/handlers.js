if (CC_WORKER_ASSET_PIPELINE) {
    const assetManagerWorkerAdapter = require("./asset-manager.js");
    ipcMain.registerHandler("assetManager", assetManagerWorkerAdapter);
}

if (CC_WORKER_AUDIO_SYSTEM) {
    const audioWorkerAdapter = require("./audio.js");
    if (audioWorkerAdapter.create != null) {
        ipcMain.registerHandler("audioAdapter", audioWorkerAdapter);
    }
}

if (CC_WORKER_WEBSOCKET) {
    const wsWorkerAdapter = require("./ws.js");
    ipcMain.registerHandler("wsAdapter", wsWorkerAdapter);
}
