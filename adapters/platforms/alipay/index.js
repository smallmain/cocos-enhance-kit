const _global = window;
const adapter = _global.__globalAdapter = {};

Object.assign(adapter, {
    init () {
        require('./wrapper/builtin');
        _global.DOMParser = require('../../common/xmldom/dom-parser').DOMParser;
        require('./wrapper/unify');
        require('./wrapper/fs-utils');
        require('../../common/engine/globalAdapter');
        require('./wrapper/systemInfo');
    },

    adaptEngine () {
        require('../../common/engine');
        require('./wrapper/engine');
    },
});