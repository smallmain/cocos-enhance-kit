let _id = 0;

class WorkerAudio {
    id = ++_id;
    callbacks = {};

    get src() {
        return this._src;
    }
    set src(str) {
        if (this._src !== str) {
            this._src = str;
            audioWorkerAdapter.call(this.id, 4, str);
        }
    }
    _src = "";

    get loop() {
        return this._loop;
    }
    set loop(v) {
        if (this._loop !== v) {
            this._loop = v;
            audioWorkerAdapter.call(this.id, 5, v);
        }
    }
    _loop = false;

    get volume() {
        return this._volume;
    }
    set volume(v) {
        if (this._volume !== v) {
            this._volume = v;
            audioWorkerAdapter.call(this.id, 6, v);
        }
    }
    _volume = 1;

    // 只读，从 Worker 单向同步值，由于是异步的，部分值会先模拟
    duration = 0;
    currentTime = 0;
    paused = true;

    constructor() {
        audioWorkerAdapter.create(this);
    }

    play() {
        this.paused = false;
        audioWorkerAdapter.call(this.id, 0, null);
    }

    pause() {
        this.paused = true;
        audioWorkerAdapter.call(this.id, 1, null);
    }

    seek(position) {
        this.paused = false;
        this.currentTime = position;
        audioWorkerAdapter.call(this.id, 2, position);
    }

    stop() {
        this.paused = true;
        audioWorkerAdapter.call(this.id, 3, null);
    }

    destroy() {
        this.paused = true;
        audioWorkerAdapter.destroy(this.id);
    }
}

[
    "Canplay",
    "Ended",
    "Error",
    "Pause",
    "Play",
    "Seeked",
    "Seeking",
    "Stop",
    "TimeUpdate",
    "Waiting",
].forEach(name => {
    WorkerAudio.prototype["on" + name] = function (callback) {
        audioWorkerAdapter.on(this.id, name, callback);
    };
    WorkerAudio.prototype["off" + name] = function (callback) {
        audioWorkerAdapter.off(this.id, name, callback);
    };
});

var audioWorkerAdapter = {
    audios: {},

    create(audio) {
        this.audios[audio.id] = audio;
        worker.audio.create([audio.id]);
    },

    call(id, type, arg) {
        worker.audio.call([id, type, arg]);
    },

    on(id, type, callback) {
        this.audios[id].callbacks[type] = callback;
        worker.audio.on([id, type]);
    },

    off(id, type, callback) {
        delete this.audios[id].callbacks[type];
        worker.audio.off([id, type]);
    },

    onCallback(args, cmdId, callback) {
        const id = args[0];
        const type = args[1];
        const data = args[2];
        this.audios[id].callbacks[type](data);
    },

    onUpdate(args, cmdId, callback) {
        // struct: [id, duration, currentTime, paused, ...id2, duration2]
        const infos = args[0];
        for (let i = 0; i < infos.length; i += 4) {
            const id = infos[i];
            const duration = infos[i + 1];
            const currentTime = infos[i + 2];
            const paused = infos[i + 3];
            const audio = this.audios[id];
            audio.duration = duration;
            audio.currentTime = currentTime;
            audio.paused = paused;
        }
    },

    destroy(id) {
        worker.audio.destroy([id]);
        delete this.audios[id];
    },
};

globalThis.WorkerAudio = WorkerAudio;
module.exports = audioWorkerAdapter;
