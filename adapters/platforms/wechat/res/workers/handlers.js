const { registerHandler } = require("./ipc-worker.js");

if (globalThis.CC_WORKER_ASSET_PIPELINE) {
    const cacheManager = require("./cache-manager-worker.js");
    registerHandler("cacheManager", cacheManager);
}
