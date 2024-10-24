var audio_worker = {
    map: {},
    create(callback, sn) {
        this.map[sn] = worker.createInnerAudioContext();
    },
    
};

module.exports = audio_worker;
