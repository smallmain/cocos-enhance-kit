require("./macro.js");
const { init } = require("./ipc-worker.js");

init(() => {
    require("./handlers.js");
});
