const { main } = require("./ipc-worker.js");
const { CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL } = globalThis;

var audio_worker = {
    map: {},
    timer: null,

    create(id) {
        this.map[id] = {
            audio: worker.createInnerAudioContext({ useWebAudioImplement: true }),
            cache: {
                duration: 0,
                currentTime: 0,
                paused: true,
            },
            callbacks: {},
        };
        if (!this.timer) {
            this.timer = setInterval(this.ensureUpdate.bind(this), CC_WORKER_AUDIO_SYSTEM_SYNC_INTERVAL);
        }
    },

    call(id, type, arg) {
        const audio = this.map[id].audio;
        switch (type) {
            case 0:
                audio.play();
                break;
            case 1:
                audio.pause();
                break;
            case 2:
                audio.seek(arg);
                break;
            case 3:
                audio.stop();
                break;
            case 4:
                audio.src = arg;
                break;
            case 5:
                audio.loop = arg;
                break;
            case 6:
                audio.volume = arg;
                break;

            default:
                break;
        }
    },

    ensureUpdate() {
        // struct: [id, duration, currentTime, paused, ...id2, duration2]
        const infos = [];
        for (const id in this.map) {
            const data = this.map[id];
            const audio = data.audio;
            const cache = data.cache;
            if (
                audio.duration !== cache.duration
                || audio.currentTime !== cache.currentTime
                || audio.paused !== cache.paused
            ) {
                cache.duration = audio.duration;
                cache.currentTime = audio.currentTime;
                cache.paused = audio.paused;
                infos.push(id, cache.duration, cache.currentTime, cache.paused);
            }
        }
        if (infos.length > 0) {
            main.audioAdapter.onUpdate(infos);
        }
    },

    on(id, type) {
        const data = this.map[id];
        data.audio["on" + type]((data.callbacks[type] = data => {
            main.audioAdapter.onCallback(id, type, data);
        }));
    },

    off(id, type) {
        const data = this.map[id];
        data.audio["off" + type](data.callbacks[type]);
        delete data.callbacks[type];
    },

    destroy(id) {
        this.map[id].destroy();
        delete this.map[id];
    },
};

module.exports = audio_worker;
