const { main } = require("./ipc-worker.js");

const methodMap = {
    1: 'GET',
    2: 'POST',
    3: 'HEAD',
    4: 'PUT',
    5: 'DELETE',
    6: 'CONNECT',
    7: 'OPTIONS',
    8: 'TRACE',
    9: 'PATCH',
};

var http_worker = {
    tasks: {},

    request(id, data, url, method, header, responseType, timeout, callback) {
        const task = worker.request({
            data,
            url: url,
            method: methodMap[method],
            header: header,
            dataType: 'other',
            responseType: responseType === 0 ? 'arraybuffer' : 'text',
            timeout: typeof timeout === "number" ? timeout : undefined,
            success: ({ data, statusCode, header }) => {
                delete this.tasks[id];
                callback(
                    true,
                    data,
                    statusCode,
                    header,
                );
            },
            fail: ({ errMsg }) => {
                delete this.tasks[id];
                callback(false, errMsg);
            },
            useHighPerformanceMode: true,
            enableHttp2: true,
            enableQuic: true,
        });
        this.tasks[id] = task;
    },

    abort(id) {
        const task = this.tasks[id];
        if (task) {
            task.abort();
            delete this.tasks[id];
        }
    },
};

module.exports = http_worker;
