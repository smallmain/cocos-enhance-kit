//
// IPC 说明
//
// - 从主线程调用 Worker：
//
//      注册：
//      1.在 worker 端调用 registerHandler(name, obj) 注册处理对象。
//      2.所有非函数属性会生成 `get_xxx()`、`set_xxx(v)`、`write_xxx(v)` 三个函数，
//        其中，`write_` 函数会在设置完毕后回调到主线程。
//      3.所有函数属性请确保第一个参数是 callback，用于回调到主线程，
//        用法是 callback(...args)。
//      
//      注册好函数后，在主线程通过 worker.name.key(args | null, (args)=>{}) 调用。
//      注意在主线程调用时传入和返回的都是参数数组。
//
// - 从 Worker 调用 主线程：
//
//      注册：
//      1.在 main 端调用 registerHandler(name, obj) 注册处理对象。
//      2.所有非函数属性会生成 `get_xxx()`、`set_xxx(v)`、`write_xxx(v)` 三个函数，
//        其中，`write_` 函数会在设置完毕后回调到 Worker。
//      3.所有函数属性请确保参数是 [args, cmdId, callback]，用于回调到 Worker，
//        用法是 callback(cmdId, args)。
//        注意在主线程回调时传入的是参数数组。
//      
//      注册好函数后，在 Worker 通过 main.name.key(...args, (...args)=>{}) 调用。
//      最后一个参数如果是函数的话则会当作 callback 处理。
//

const { CC_WORKER_SCHEDULER, CC_WORKER_DEBUG } = globalThis;


var _inited = false;
var _initCallback = null;

var _cmdId = 0;
var callbacks = {};

var _cmd = 0;
var handlers = {};

function callToMain(cmd, args) {
    const id = ++_cmdId;
    const msg = [id, cmd, args];

    if (typeof args[args.length - 1] === "function") {
        const callback = args.pop();
        callbacks[id] = callback;
    }

    if (CC_WORKER_DEBUG) {
        console.log("worker send call:", msg);
    }

    if (CC_WORKER_SCHEDULER) {
        sendScheduler.send(msg);
    } else {
        worker.postMessage(msg);
    }
}

function callbackToMain(id, cmd, args) {
    const msg = [id, cmd, args];
    if (CC_WORKER_DEBUG) {
        console.log("worker send callback:", msg);
    }
    if (CC_WORKER_SCHEDULER) {
        sendScheduler.send(msg);
    } else {
        worker.postMessage(msg);
    }
}

function registerHandler(name, obj) {
    const descs = Object.getOwnPropertyDescriptors(obj);
    for (const key in descs) {
        const desc = descs[key];

        if (typeof desc.value === "function") {
            const cmd = ++_cmd;
            handlers[cmd] = {
                name,
                key,
                func: (id, cmd, args) => {
                    obj[key](
                        (...args) => {
                            callbackToMain(id, cmd, args);
                        },
                        ...(args ? args : []),
                    );
                },
            };
        } else {
            // getter/setter
            let cmd = ++_cmd;
            handlers[cmd] = {
                name,
                key: "get_" + key,
                func: (id, cmd, args) => {
                    callbackToMain(id, cmd, [obj[key]]);
                }
            };
            cmd = ++_cmd;
            handlers[cmd] = {
                name,
                key: "set_" + key,
                func: (id, cmd, args) => {
                    obj[key] = args ? args[0] : undefined;
                }
            };
            cmd = ++_cmd;
            handlers[cmd] = {
                name,
                key: "write_" + key,
                func: (id, cmd, args) => {
                    obj[key] = args ? args[0] : undefined;
                    callbackToMain(id, cmd, null);
                }
            };
        }
    }
}

function init(callback) {
    _initCallback = callback;

    if (CC_WORKER_SCHEDULER) {
        sendScheduler.init();
    }

    worker.onMessage(CC_WORKER_SCHEDULER
        ? msgs => {
            for (let index = 0; index < msgs.length; index++) {
                const msg = msgs[index];
                handleMainMessage(msg);
            }
        }
        : handleMainMessage
    );
}

function _initFromWorker(id, meta) {
    const [
        wrappers,
        CC_WORKER_FS_SYNC,
        CC_WORKER_ASSET_PIPELINE,
        CC_WORKER_AUDIO_SYSTEM,
        CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL,
    ] = meta;

    for (const wrapper of wrappers) {
        const { name, key, cmd } = wrapper;
        if (!main[name]) {
            main[name] = {};
        }
        main[name][key] = (...args) => {
            callToMain(cmd, args);
        };
    }

    globalThis.CC_WORKER_FS_SYNC = CC_WORKER_FS_SYNC;
    globalThis.CC_WORKER_ASSET_PIPELINE = CC_WORKER_ASSET_PIPELINE;
    globalThis.CC_WORKER_AUDIO_SYSTEM = CC_WORKER_AUDIO_SYSTEM;
    globalThis.CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL = CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL;

    _inited = true;
    if (_initCallback) _initCallback();

    const _handlers = [];
    for (const cmd in handlers) {
        const { name, key } = handlers[cmd];
        _handlers.push({ name, cmd: Number(cmd), key });
    }

    callbackToMain(id, 0, _handlers);
}

function handleMainMessage(msg) {
    // 格式：[id, cmd, [args]]
    // 如果 cmd 是正数，则是主线程的调用
    // 反之，是返回到 Worker 的 Callback

    // [0, 0, meta] 为初始化调用

    const id = msg[0];
    const cmd = msg[1];
    const args = msg[2];

    if (cmd > 0) {
        const handler = handlers[cmd];

        if (handler) {
            const { func, name, key } = handler;
            if (CC_WORKER_DEBUG) {
                console.log(`worker recv call (${name}.${key}):`, msg);
            }
            func(id, cmd, args);
        } else {
            console.error("worker recv unknown call:", msg);
        }
    } else if (cmd < 0) {
        if (CC_WORKER_DEBUG) {
            console.log("worker recv callback:", msg);
        }
        if (callbacks[id]) {
            callbacks[id](msg.slice(2));
            delete callbacks[id];
        }
    } else {
        if (CC_WORKER_DEBUG) {
            console.log("worker recv init:", msg);
        }
        _initFromWorker(id, args);
    }
}

const sendScheduler = {
    queue: [],

    init() {
        setInterval(() => {
            if (this.queue.length > 0) {
                worker.postMessage(this.queue);
                this.queue = [];
            }
        }, 0);
    },

    send(msg) {
        this.queue.push(msg);
    },
};

const main = {};

module.exports = { init, registerHandler, main };
