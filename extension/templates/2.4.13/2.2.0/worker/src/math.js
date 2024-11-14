const { registerHandler } = require("ipc-worker.js");

export function add(x, y, callback) {
    callback(x + y);
}

registerHandler("math", {
    add,
});
