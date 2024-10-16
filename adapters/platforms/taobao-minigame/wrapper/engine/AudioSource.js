
(function(){
    if (!(cc && cc.AudioClip && cc.AudioSource)) {
        return;
    }
    const Audio = require('./Audio');
    const AudioClip = cc.AudioClip;
    const proto = cc.AudioSource.prototype;

    Object.defineProperties(proto, {
        isPlaying: {
            get () {
                var state = this.audio.getState();
                return state === cc._Audio.State.PLAYING;
            }
        },
        clip: {
            get: function () {
                return this._clip;
            },
            set: function (value) {
                if (value === this._clip) {
                    return;
                }
                if (!(value instanceof AudioClip)) {
                    return cc.error('Wrong type of AudioClip.');
                }
                this._clip = value;
                this.audio.stop();
                this.audio.destroy();
                this.audio = new Audio(value.nativeUrl, value.duration);
            },
        },
        
        volume: {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                value = misc.clamp01(value);
                this._volume = value;
                if (!this._mute) {
                    this.audio.setVolume(value);
                }
                return value;
            },
        },
        
        mute: {
            get: function () {
                return this._mute;
            },
            set: function (value) {
                if (this._mute === value) {
                    return;
                }
                this._mute = value;
                this.audio.setVolume(value ? 0 : this._volume);
                return value;
            },
        },
        
        loop: {
            get: function () {
                return this._loop;
            },
            set: function (value) {
                this._loop = value;
                this.audio.setLoop(value);
                return value;
            }
        },
    })
    Object.assign(proto, {
        onLoad: function () {
            if(this.audio && this.audio instanceof Audio) 
                return;
                
            if (this._clip) {
                this.audio = new Audio(this._clip.nativeUrl, this._clip.duration);
            }
        },

        onEnable: function () {
            if (this.playOnLoad && this._firstlyEnabled) {
                this._firstlyEnabled = false;
                this.play();
            }
        },

        onDisable: function () {
            this.stop();
        },

        onDestroy: function () {
            this.audio.destroy();
        },
        
        play: function () {
            if ( !this._clip ) return;

            var audio = this.audio;
            audio.setVolume(this._mute ? 0 : this._volume);
            audio.setLoop(this._loop);
            audio.seek(0);
            audio.play();
        },
        
        stop: function () {
            this.audio.stop();
        },
        
        pause: function () {
            this.audio.pause();
        },
        
        resume: function () {
            this.audio.resume();
        },
        
        rewind: function(){
            this.audio.seek(0);
        },
        
        getCurrentTime: function () {
            return this.audio.getCurrentTime();
        },
        
        setCurrentTime: function (time) {
            this.audio.seek(time);
            return time;
        },

        getDuration: function () {
            return this.audio.getDuration();
        }
    });

})();