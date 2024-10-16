const game = cc.game;
const EventTarget = cc.EventTarget;

const State = {
    ERROR: -1,
    INITIALZING: 0,
    PLAYING: 1,
    PAUSED: 2,
    STOPPED: 3,
}

function Audio (url, serializedDuration) {
    this._nativeAudio = my.createInnerAudioContext();
    this._et = new EventTarget();
    this.reset();
    this._setSrc(url);
    const nativeAudio = this._nativeAudio;
    this._serializedDuration = serializedDuration;
    this._ensureLoaded(() => {
        this._duration = nativeAudio.duration;
    });
    this._duration = 1;
    this._onShow = () => {
        if (this._blocked) {
            this._nativeAudio.play();
        }
        this._blocked = false;
    };
    this._onHide = () => {
        if (this.getState() === State.PLAYING) {
            this._nativeAudio.pause();
            this._blocked = true;
        }
    };
    nativeAudio.onCanplay(() => { this._et.emit('load'); });
    nativeAudio.onError((err) => { this._et.emit('error', err); });
    nativeAudio.onEnded(() => {
        this.finishCB && this.finishCB();
        this._state = State.INITIALZING;
        this._et.emit('ended');
    });
    nativeAudio.onStop(() => { this._et.emit('stop'); });
    nativeAudio.onTimeUpdate(() => { this._currentTime = nativeAudio.currentTime; });
    game.on(game.EVENT_SHOW, this._onShow);
    game.on(game.EVENT_HIDE, this._onHide);
    this.onError((err) => { cc.error(err); });
}

Audio.State = State;

Object.assign(Audio.prototype, {

    reset () {
        this.id = -1;
        this.finishCB = null;  // For audioEngine custom ended callback.
        this._state = State.INITIALZING;
        this._loop = false;
        this._currentTime = 0;
        this._volume = 1;
        this._blocked = false;
        this._loaded = false;

        this.offLoad();
        this.offError();
        this.offEnded();
        this.offStop();
    },

    destroy () {
        this.reset();
        game.off(game.EVENT_SHOW, this._onShow);
        game.off(game.EVENT_HIDE, this._onHide);
        // offCanplay offOnError offStop offEnded is not supported for now.

        this._nativeAudio.destroy();
        this._nativeAudio = null;
    },

    getSrc () { return this._src; },
    // NOTE: don't set src twice, which is not supported on TAOBAO
    _setSrc (path) { 
        if (this._src === path) {
            return;
        }
        const nativeAudio = this._nativeAudio;
        this._loaded = false;
        nativeAudio.src = path;
        this._src = path;
    },
    getState () { return this._state; },
    getDuration () { return this._serializedDuration ? this._serializedDuration : this._duration; },
    getCurrentTime () { return this._currentTime; },
    seek (val) {
        if (this._currentTime === val) {
            return;
        }
        this._ensureLoaded(() => {
            this._nativeAudio.seek(val);
            this._currentTime = val;
        });
    },
    getLoop () { return this._loop; },
    setLoop (val) {
        if (this._loop === val) {
            return;
        }
        this._ensureLoaded(() => {
            this._nativeAudio.loop = val;
            this._loop = val;
        });
    },
    getVolume () { return this._volume; },
    setVolume (val) {
        if (this._volume === val) {
            return;
        }
        this._ensureLoaded(() => {
            this._nativeAudio.volume = val;
            this._volume = val;
        });
    },

    play () {
        if (this.getState() !== State.PLAYING) {
            this._nativeAudio.play();
            this._state = State.PLAYING;
        }
    },
    resume () {
        if (this.getState() === State.PAUSED) {
            this._nativeAudio.play();
            this._state = State.PLAYING;
        }
    },
    pause () {
        if (this.getState() === State.PLAYING) {
            this._nativeAudio.pause();
            this._state = State.PAUSED;
        }
    },
    stop () {
        // NOTE: On taobao, it is designed that audio is useless after stopping.
        // this._nativeAudio.stop();
        this._nativeAudio.pause();
        this._nativeAudio.seek(0);
        this._state = State.STOPPED;
    },

    onceLoad (cb) { this._et.once('load', cb); },
    onLoad (cb) { this._et.on('load', cb); },
    offLoad (cb = undefined) { this._et.off('load', cb); },
    onError (cb) { this._et.on('error', cb); },
    offError (cb = undefined) { this._et.off('error', cb); },
    onEnded (cb) { this._et.on('ended', cb); },
    offEnded (cb = undefined) { this._et.off('ended', cb); },
    onStop (cb) { this._et.on('stop', cb); },
    offStop (cb = undefined) { this._et.off('stop', cb); },

    _ensureLoaded (cb) {
        if (this._loaded) {
            cb();
        } else {
            this.onceLoad(() => {
                this._loaded = true;
                cb();
            });
        }
    }
});

module.exports = Audio;