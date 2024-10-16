const Audio = cc._Audio;

if (Audio) {
    let originGetDuration = Audio.prototype.getDuration;
    Object.assign(Audio.prototype, {
        _createElement () {
            let elem = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = __globalAdapter.createInnerAudioContext();
            }
            this._element.src = elem.src;
        },

        destroy () {
            if (this._element) {
                this._element.destroy();
                this._element = null;
            }
        },

        setCurrentTime (num) {
            let self = this;
            this._src && this._src._ensureLoaded(function () {
                self._element.seek(num);
            });
        },

        stop () {
            let self = this;
            this._src && this._src._ensureLoaded(function () {
                // HACK: some platforms won't set currentTime to 0 when stop audio
                self._element.seek(0);
                self._element.stop();
                self._unbindEnded();
                self.emit('stop');
                self._state = Audio.State.STOPPED;
            });
        },

        _bindEnded () {
            let elem = this._element;
            if (elem && elem.onEnded && !this._onended._binded) {
              this._onended._binded = true;
              elem.onEnded(this._onended);
            }
        },

        _unbindEnded () {
            let elem = this._element;
            if (elem && elem.offEnded && this._onended._binded) {
              this._onended._binded = false;
              elem.offEnded && elem.offEnded(this._onended);
            }
        },

        getDuration () {
            let duration = originGetDuration.call(this);
            // HACK: in mini game, if dynamicly load audio, can't get duration from audioClip
            // because duration is not coming from audio deserialization
            duration = duration || (this._element ? this._element.duration : 0);
            return duration;
        },

        // adapt some special operations on web platform
        _touchToPlay () { },
        _forceUpdatingState () { },
    });
}
