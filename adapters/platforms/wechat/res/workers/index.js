require("./macro.js");
const { init } = require("./ipc-worker.js");
const { CC_CUSTOM_WORKER } = globalThis;

init(() => {
    require("./handlers.js");
    if (CC_CUSTOM_WORKER) {
        try {
            require("./custom/index.js");
        } catch (error) {
            console.error("worker init custom extension error:", error);
        }
    }
});
