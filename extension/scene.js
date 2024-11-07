module.exports = {

    'scene-get-engine-version': function (event) {
        if (event.reply) {
            event.reply(null, cc.ENGINE_VERSION);
        }
    },

};
