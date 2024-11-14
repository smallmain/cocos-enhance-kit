const { registerHandler } = require("./ipc-worker.js");

if (globalThis.CC_WORKER_ASSET_PIPELINE) {
    const cacheManager = require("./cache-manager-worker.js");
    registerHandler("cacheManager", cacheManager);
}

if (globalThis.CC_WORKER_AUDIO_SYSTEM) {
    const audio = require("./audio-worker.js");
    registerHandler("audio", audio);
}

if (globalThis.CC_WORKER_HTTP_REQUEST) {
    const http = require("./http-worker.js");
    registerHandler("http", http);
}
