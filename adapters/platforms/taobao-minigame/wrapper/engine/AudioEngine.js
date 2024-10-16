const Audio = require('./Audio');

let _instanceId = 0;
const _id2audio = {};
const _audioPool = [];
const _maxPoolSize = 32;

function handleVolume (volume) {
    if (volume === undefined) {
        // set default volume as 1
        volume = 1;
    }
    else if (typeof volume === 'string') {
        volume = Number.parseFloat(volume);
    }
    return volume;
};

function getOrCreateAudio (path, serializedDuration) {
    let audio;
    _audioPool.some((item, index) => {
        if (item.getSrc() === path) {
            audio = item;
            _audioPool.splice(index, 1);
            return true;
        }
        return false;
    });
    if (!audio) {
        audio = new Audio(path, serializedDuration);
    }
    audio.id = ++_instanceId;
    audio.onEnded(() => {
        putOrDestroyAudio(audio);
    });
    return audio;
}

function putOrDestroyAudio (audio) {
    if (_audioPool.includes(audio)) {
        return;
    }
    delete _id2audio[audio.id];
    audio.reset();
    if (_audioPool.length < _maxPoolSize) {
        _audioPool.push(audio);
    } else {
        audio.destroy();
    }
}

const _maxPlayingAudio = 10;


cc.audioEngine = {

    AudioState: Audio.State,

    _maxPoolSize: 32,

    _id2audio,

    _pauseIDCache: [],

    _play (clip, loop, volume) {
        let path;
        if (typeof clip === 'string') {
            path = clip;
        } else {
            path = clip.nativeUrl;
        }
        let audio = getOrCreateAudio(path, clip.duration);

        volume = handleVolume(volume);
        audio.setLoop(loop || false);
        audio.setVolume(volume);

        audio.play();

        return audio;
    },

    play: function (clip, loop, volume) {
        const audio = this._play(clip, loop, volume);
        this._id2audio[audio.id] = audio;
        return audio.id;
    },

    setLoop: function (id, loop) {
        const audio = this._id2audio[id];
        if (audio) {
            audio.setLoop(loop);
        }
    },

    isLoop: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getLoop();
        }
        return false;        
    },

    setVolume: function (id, volume) {
        volume = handleVolume(volume);
        const audio = this._id2audio[id];
        if (audio) {
            return audio.setVolume(volume);
        }
    },

    getVolume: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getVolume();
        }
        return 1;        
    },
    
    setCurrentTime: function (id, sec) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.seek(sec);
        }
    },

    
    getCurrentTime: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getCurrentTime();
        }
        return 0;
    },
    
    getDuration: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getDuration();
        }
        return 1;        
    },

    
    getState: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getState();
        }
        return Audio.State.INITIALZING;
        
    },

    
    isPlaying: function(id) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.getState() === Audio.State.PLAYING;
        }
        return false;        
    },

    setFinishCallback: function (id, callback) {
        const audio = this._id2audio[id];
        if (audio) {
            return audio.finishCB = callback;
        }        
    },

    
    pause: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            audio.pause();
        }        
    },

    
    pauseAll: function () {
        for (let id in this._id2audio) {
            const audio = this._id2audio[id];
            if (audio) {
                audio.pause();
            }
        }
    },

    resume: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            audio.resume();
        }    
    },

    resumeAll: function () {
        for (let id in this._id2audio) {
            const audio = this._id2audio[id];
            if (audio) {
                audio.resume();
            }
        }     
    },

    
    stop: function (id) {
        const audio = this._id2audio[id];
        if (audio) {
            audio.stop();
        }        
    },

    
    stopAll: function () {
        for (let id in this._id2audio) {
            const audio = this._id2audio[id];
            if (audio) {
                audio.stop();
            }
        }      
    },

    
    setMaxAudioInstance: function (num) {
        // NOT SUPPPORTED
    },

    getMaxAudioInstance: function () {
        return _maxPlayingAudio;
    },
    
    uncache: function (clip) {
        var filePath = clip;
        if (typeof clip === 'string') {
            // backward compatibility since 1.10
            cc.warnID(8401, 'cc.audioEngine', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
            filePath = clip;
        }
        else {
            if (!clip) {
                return;
            }
            filePath = clip.nativeUrl;
        }

        for (let id in _id2audio) {
            const audio = this._id2audio[id];
            if (audio && audio.getSrc() === filePath) {
                audio.stop();
                putOrDestroyAudio(audio);
            }
        }
    },

    uncacheAll: function () {
        this.stopAll();
        for (let id in _id2audio) {
            const audio = _id2audio[id];
            if (audio) {
                audio.stop();
                putOrDestroyAudio(audio);
            }
        }
    },

    _break: function () {
        // DO NOTHING
    },

    _restore: function () {
        // DO NOTHING        
    },

    ///////////////////////////////
    // Classification of interface

    _music: null,
    
    _effectVolume: 1,
    
    playMusic: function (clip, loop) {
        if (this._music) {
            if (this._music.getSrc() !== clip.nativeUrl) {
                this._music.stop();
                putOrDestroyAudio(this._music);
                const audio = this._play(clip, loop);
                this._music = audio;
            } else {
                this._music.stop();
                this._music.play();
            }
        } else {
            const audio = this._play(clip, loop);
            this._music = audio;
        }
        return this._music.id;
    },

    
    stopMusic: function () {
        this._music.stop();
    },

    
    pauseMusic: function () {
        this._music.pause();     
    },

    
    resumeMusic: function () {
        this._music.resume();
    },
    
    getMusicVolume: function () {
        if (this._music) {
            return this._music.getVolume();
        }
        return 1;
    },
    
    setMusicVolume: function (volume) {
        volume = handleVolume(volume);
        if (this._music) {
            this._music.setVolume(volume);
        }
    },
    
    isMusicPlaying: function () {
        return this._music.getState() === Audio.State.PLAYING;
    },
    
    playEffect: function (clip, loop) {
        return this.play(clip, loop, this._effectVolume);
    },
    
    setEffectsVolume: function (volume) {
        volume = handleVolume(volume);
        var musicId = this._music.id;
        this._effectVolume = volume;
        for (var id in _id2audio) {
            var audio = _id2audio[id];
            if (!audio || audio.id === musicId) continue;
            audio.setVolume(volume);
        }
    },
    
    getEffectsVolume: function () {
        return this._effectVolume;
    },
    
    pauseEffect: function (id) {
        return this.pause(id);
    },
    
    pauseAllEffects: function () {
        var musicId = this._music.id;
        for (var id in _id2audio) {
            var audio = _id2audio[id];
            if (!audio || audio.id === musicId) continue;
            audio.pause();
        }
    },
    
    resumeEffect: function (id) {
        this.resume(id);   
    },
    
    resumeAllEffects: function () {
        var musicId = this._music.id;
        for (var id in _id2audio) {
            var audio = _id2audio[id];
            if (!audio || audio.id === musicId) continue;
            audio.resume();
        }     
    },
    
    stopEffect: function (id) {
        return this.stop(id);    
    },
    
    stopAllEffects: function () {
        var musicId = this._music.id;
        for (var id in _id2audio) {
            var audio = _id2audio[id];
            if (!audio || audio.id === musicId) continue;
            audio.stop();
        } 
    }
};
 