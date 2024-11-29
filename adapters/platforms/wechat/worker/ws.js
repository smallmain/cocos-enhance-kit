let _id = 0;

class WorkerWebSocket {
    id = _id++;

    onopen = null;
    onclose = null;
    onerror = null;
    onmessage = null;

    constructor(url, protocols) {
        wsWorkerAdapter.register(this);
        worker.ws.connectSocket([this.id, url, protocols]);
    }

    onOpen(cb) {
        this.onopen = cb;
    }

    onMessage(cb) {
        this.onmessage = cb;
    }

    onClose(cb) {
        this.onclose = cb;
    }

    onError(cb) {
        this.onerror = cb;
    }

    send(res) {
        worker.ws.send([this.id, res.data]);
    }

    close(res) {
        worker.ws.close([this.id, res.code, res.reason]);
    }
}

var wsWorkerAdapter = {
    sockets: {},

    register(socket) {
        this.sockets[socket.id] = socket;
    },

    onOpen(args, cmdId, callback) {
        const id = args[0];
        const ws = this.sockets[id];
        if (ws) {
            ws.onopen?.();
        }
    },

    onMessage(args, cmdId, callback) {
        const id = args[0];
        const data = args[1];
        const ws = this.sockets[id];
        if (ws) {
            ws.onmessage?.({ data });
        }
    },

    onClose(args, cmdId, callback) {
        const id = args[0];
        const data = args[1];
        const ws = this.sockets[id];
        if (ws) {
            ws.onclose?.(data);
            delete this.sockets[id];
        }
    },

    onError(args, cmdId, callback) {
        const id = args[0];
        const data = args[1];
        const ws = this.sockets[id];
        if (ws) {
            ws.onerror?.(data);
            delete this.sockets[id];
        }
    },
};

globalThis.WorkerWebSocket = WorkerWebSocket;
module.exports = wsWorkerAdapter;
