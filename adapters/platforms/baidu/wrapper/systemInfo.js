const adapter = window.__globalAdapter;
let adaptSysFunc = adapter.adaptSys;

Object.assign(adapter, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys, GameGlobal._env);
        delete GameGlobal._env;  // release env

        // baidugame subdomain
        if (!swan.getOpenDataContext) {
            sys.platform = sys.BAIDU_GAME_SUB;
        }
        else {
            sys.platform = sys.BAIDU_GAME;
        }

        // sys.glExtension = function (name) {
        //     if (name === 'OES_texture_float') {
        //         return false;
        //     }
        //     return !!cc.renderer.device.ext(name);
        // };
    },
});