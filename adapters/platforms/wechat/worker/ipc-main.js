const ipcMain = {
    worker: null,

    cmdId: 0,

    callbacks: {},

    _cmd: 0,

    handlers: {},

    _inited: false,

    _initCallback: null,

    init(callback) {
        this._initCallback = callback;

        const loadSrc = (cb) => {
            if (CC_WORKER_SUB_PACKAGE) {
                wx.preDownloadSubpackage({
                    packageType: "workers",
                    success() {
                        cb();
                    },
                    fail(res) {
                        console.error("load worker fail:", res);
                        loadSrc(cb);
                    }
                });
            } else {
                cb();
            }
        };

        loadSrc(() => {
            // NOTE { useExperimentalWorker: true } 会让有状态的 Worker 处理很复杂，暂时不使用
            this.worker = wx.createWorker("workers/index.js");

            this.worker.onMessage(
                CC_WORKER_SCHEDULER
                    ? msgs => {
                        for (let index = 0; index < msgs.length; index++) {
                            const msg = msgs[index];
                            this._handleWorkerMessage(msg);
                        }
                    }
                    : this._handleWorkerMessage.bind(this)
            );

            if (CC_WORKER_SCHEDULER) {
                sendScheduler.init(this);
            }

            this._init();
        });
    },

    _handleWorkerMessage(msg) {
        // 格式：[id, cmd, [args] | null]
        // 如果 cmd 是正数，则是返回到主线程的 Callback
        // 反之，是 Worker 的调用

        // [-, 0, handlers] 为初始化调用

        const id = msg[0];
        const cmd = msg[1];
        const args = msg[2];

        if (cmd > 0) {
            if (CC_WORKER_DEBUG) {
                console.log("main thread recv callback:", msg);
            }
            const callback = this.callbacks[id];
            if (callback) {
                callback(args);
                delete this.callbacks[id];
            }
        } else if (cmd < 0) {
            const handler = this.handlers[cmd];

            if (handler) {
                const { func, name, key, callback } = handler;

                if (CC_WORKER_DEBUG) {
                    console.log(`main thread recv call (${name}.${key}):`, msg);
                }

                func(args, id, callback);
            } else {
                console.error("main thread recv unknown call:", msg);
            }
        } else {
            if (CC_WORKER_DEBUG) {
                console.log("main thread recv init:", msg);
            }
            this._initFromWorker(args);
        }
    },

    _init() {
        const _handlers = [];
        for (const cmd in this.handlers) {
            const { name, key } = this.handlers[cmd];
            _handlers.push({ name, cmd: Number(cmd), key });
        }

        this.callToWorker(0, [
            _handlers,
            CC_WORKER_FS_SYNC,
            CC_WORKER_ASSET_PIPELINE,
            CC_WORKER_AUDIO_SYSTEM,
        ]);
    },

    _initFromWorker(wrappers) {
        for (const wrapper of wrappers) {
            const { name, key, cmd } = wrapper;
            if (!worker[name]) {
                worker[name] = {};
            }
            worker[name][key] = (args, callback) => {
                this.callToWorker(cmd, args, callback);
            };
        }

        this._inited = true;
        if (this._initCallback) this._initCallback();
    },

    callbackToWorker(id, cmd, args) {
        const msg = [id, cmd, args];

        if (CC_WORKER_DEBUG) {
            console.log("main thread send callback:", msg);
        }

        if (CC_WORKER_SCHEDULER) {
            sendScheduler.send(msg);
        } else {
            this.worker.postMessage(msg);
        }
    },

    callToWorker(cmd, args, callback) {
        const id = ++this.cmdId;

        if (callback) {
            this.callbacks[id] = callback;
        }

        const msg = [id, cmd, args];

        if (CC_WORKER_DEBUG) {
            console.log("main thread send call:", msg);
        }

        if (CC_WORKER_SCHEDULER) {
            sendScheduler.send(msg);
        } else {
            this.worker.postMessage(msg);
        }
    },

    registerHandler(name, obj) {
        const descs = Object.getOwnPropertyDescriptors(obj);

        for (const key in descs) {
            const desc = descs[key];

            if (typeof desc.value === "function") {
                const cmd = ++this._cmd;
                this.handlers[cmd] = {
                    name,
                    key,
                    func: obj[key].bind(obj),
                    callback: (id, args) => this.callbackToWorker(id, cmd, args),
                };
            } else {
                // getter/setter
                const cmd1 = ++this._cmd;
                this.handlers[cmd1] = {
                    name,
                    key: "get_" + key,
                    func: (args, id, callback) => {
                        this.callbackToWorker(id, cmd1, [obj[key]]);
                    },
                    callback: null,
                };
                const cmd2 = ++this._cmd;
                this.handlers[cmd2] = {
                    name,
                    key: "set_" + key,
                    func: (args, id, callback) => {
                        obj[key] = args[0];
                    }
                };
                const cmd3 = ++this._cmd;
                this.handlers[cmd3] = {
                    name,
                    key: "write_" + key,
                    func: (args, id, callback) => {
                        obj[key] = args[0];
                        this.callbackToWorker(id, cmd3, null);
                    }
                };
            }
        }
    },
};

const sendScheduler = {
    queue: [],
    ipc: null,

    init(ipc) {
        this.ipc = ipc;
        setInterval(() => {
            if (this.queue.length > 0) {
                this.ipc.worker.postMessage(this.queue);
                this.queue = [];
            }
        }, 0);
    },

    send(msg) {
        this.queue.push(msg);
    },
};

const worker = {};

globalThis.ipcMain = ipcMain;
globalThis.worker = worker;
