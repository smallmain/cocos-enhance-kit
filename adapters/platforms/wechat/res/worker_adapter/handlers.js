if (CC_WORKER_ASSET_PIPELINE) {
    const assetManagerWorkerAdapter = require("./asset-manager.js");
    ipcMain.registerHandler("assetManager", assetManagerWorkerAdapter);
}
