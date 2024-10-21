module.exports = globalThis.CC_WORKER_FS_SYNC ? require("./fs-utils-sync.js") : require("./fs-utils-async.js");
