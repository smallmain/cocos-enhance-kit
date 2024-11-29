const { main } = require("./ipc-worker.js");

var ws_worker = {
    sockets: {},

    connectSocket(id, url, protocols) {
        try {
            const ws = worker.connectSocket({
                url,
                protocols,
                tcpNoDelay: true,
            });

            this.sockets[id] = ws;

            ws.onOpen(() => {
                main.wsAdapter.onOpen(id);
            });

            ws.onMessage(res => {
                main.wsAdapter.onMessage(id, hookWSRecv ? hookWSRecv(res.data) : res.data);
            });

            ws.onError(res => {
                delete this.sockets[id];
                main.wsAdapter.onError(id, res);
            });

            ws.onClose(res => {
                delete this.sockets[id];
                main.wsAdapter.onClose(id, res);
            });
        } catch (error) {
            main.wsAdapter.onError(id, { errMsg: String(error) });
        }
    },

    send(id, data) {
        const ws = this.sockets[id];
        if (ws) {
            ws.send({
                data: hookWSSend ? hookWSSend(data) : data,
            });
        }
    },

    close(id, code, reason) {
        const ws = this.sockets[id];
        if (ws) {
            ws.close({
                code,
                reason,
            });
        }
    },
};

module.exports = ws_worker;
