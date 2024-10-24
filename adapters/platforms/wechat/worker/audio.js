let _id = 0;

class WorkerAudio {
    id = ++_id;

    get src() {

    }
    set src(str) {

    }

    get loop() {

    }
    set loop(v) {

    }
    _loop = false;

    get volume() {

    }
    set volume(v) {

    }
    _volume = 1;

    // 只读，从 Worker 单向同步值
    duration = 0;
    currentTime = 0;
    paused = true;

    constructor() {

    }

    get src() {

    }
    set src(clip) {

    }

    play() {

    }

    pause() {

    }

    seek() {

    }

    stop() {

    }

    destroy() {

    }

}

var audioWorkerAdapter = {
    on(id, callback) {

    },
    off(id, callback) {

    },
};

globalThis.WorkerAudio = WorkerAudio;
module.exports = audioWorkerAdapter;
